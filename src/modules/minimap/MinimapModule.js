import { cardsManager, layersManager, emitter } from "../../core";

const TAB_ID = "minimapTab";
const REDRAW_MS = 150;
const PADDING = 80;

class MinimapModule {
    constructor(camera) {
        this.camera = camera;
        this.stage = layersManager.stage;
        this.boardLayer = layersManager.getLayer("board");

        this.canvas = null;
        this.timer = null;
        this.map = null;
        this.dragging = false;

        /* Содержимое таба пересоздаётся при каждом переключении - цепляемся после рендера */
        emitter.on("modules.tabs.rendered", id => {
            if ( id === TAB_ID ) this.attach();
        });
    }

    render() {
        return `<div class="minimap"><canvas class="minimap-canvas"></canvas></div>`;
    }

    attach() {
        this.stop();

        this.canvas = document.querySelector(".minimap-canvas");
        if ( !this.canvas ) return;

        this.canvas.addEventListener("pointerdown", e => {
            this.dragging = true;
            this.canvas.setPointerCapture(e.pointerId);
            this.goTo(e);
        });
        this.canvas.addEventListener("pointermove", e => {
            if ( this.dragging ) this.goTo(e);
        });
        const end = () => { this.dragging = false; };
        this.canvas.addEventListener("pointerup", end);
        this.canvas.addEventListener("pointercancel", end);

        this.draw();
        this.timer = setInterval(() => this.draw(), REDRAW_MS);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
        this.map = null;
    }

    /* Прямоугольники всех карт в координатах доски */
    collect() {
        const fields = [];
        const cards = [];

        for ( const card of cardsManager.cards.values() ) {
            const el = card.element;
            if ( !el || !el.visible() ) continue;

            const r = el.getClientRect({ relativeTo: this.boardLayer, skipShadow: true, skipStroke: true });
            if ( !r.width || !r.height ) continue;

            (card.banTaking ? fields : cards).push(r);
        }

        return { fields, cards };
    }

    draw() {
        const c = this.canvas;
        if ( !c || !c.isConnected ) return this.stop();
        if ( document.hidden ) return;

        const w = c.clientWidth;
        const h = c.clientHeight;
        if ( !w || !h ) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if ( c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr) ) {
            c.width = Math.round(w * dpr);
            c.height = Math.round(h * dpr);
        }

        const ctx = c.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const { fields, cards } = this.collect();
        const all = fields.concat(cards);
        if ( !all.length ) return;

        /* Границы мира = все карты + отступ; карта вписывается с сохранением пропорций */
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for ( const r of all ) {
            minX = Math.min(minX, r.x);
            minY = Math.min(minY, r.y);
            maxX = Math.max(maxX, r.x + r.width);
            maxY = Math.max(maxY, r.y + r.height);
        }
        minX -= PADDING; minY -= PADDING; maxX += PADDING; maxY += PADDING;

        const k = Math.min(w / (maxX - minX), h / (maxY - minY));
        const ox = (w - (maxX - minX) * k) / 2 - minX * k;
        const oy = (h - (maxY - minY) * k) / 2 - minY * k;
        this.map = { k, ox, oy };

        const rect = (r, fill) => {
            ctx.fillStyle = fill;
            ctx.fillRect(r.x * k + ox, r.y * k + oy, Math.max(r.width * k, 1.5), Math.max(r.height * k, 1.5));
        };

        fields.forEach(r => rect(r, "rgba(148, 163, 184, 0.18)"));
        cards.forEach(r => rect(r, "rgba(248, 250, 252, 0.75)"));

        /* Пресеты камеры */
        const presets = this.camera.presets;
        if ( presets ) {
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            presets.items.forEach((p, i) => {
                if ( i === 0 ) return;
                const x = p.view.x * k + ox;
                const y = p.view.y * k + oy;

                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.fillStyle = i === presets.active ? "#6366f1" : "rgba(15, 23, 42, 0.9)";
                ctx.fill();
                ctx.strokeStyle = "#6366f1";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = "#fff";
                ctx.fillText(String(i + 1), x, y + 0.5);
            });
        }

        /* Текущий вид камеры (с учётом поворота сцены это многоугольник) */
        const inv = this.stage.getAbsoluteTransform().copy().invert();
        const sw = this.stage.width();
        const sh = this.stage.height();
        const pts = [[0, 0], [sw, 0], [sw, sh], [0, sh]].map(([x, y]) => inv.point({ x, y }));

        ctx.beginPath();
        pts.forEach((p, i) => {
            const x = p.x * k + ox;
            const y = p.y * k + oy;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.fill();
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /* Клик / перетаскивание по миникарте: центрируем камеру, зум не меняем */
    goTo(e) {
        if ( !this.map ) return;

        const r = this.canvas.getBoundingClientRect();
        const x = (e.clientX - r.left - this.map.ox) / this.map.k;
        const y = (e.clientY - r.top - this.map.oy) / this.map.k;

        this.camera.setView({ x, y, zoom: this.camera.getView().zoom });
        this.draw();
    }
}

export default MinimapModule;