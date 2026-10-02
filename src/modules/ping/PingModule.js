import Konva from "konva";
import { layersManager, usersManager, senderManager, emitter } from "../../core";
import userColor from "../../utils/userColor";

const COOLDOWN_MS = 350;
const EDGE_MARGIN = 36;
const EDGE_LIFE_MS = 1800;
const RING_COUNT = 3;
const RING_STEP_MS = 250;

class PingModule {
    constructor() {
        this.stage = layersManager.stage;
        this.layer = layersManager.getLayer("cursors");

        this.last = 0;
        this.edges = new Set();
        this.raf = null;

        this.edgeRoot = document.createElement("div");
        this.edgeRoot.className = "ping-edges";
        document.body.appendChild(this.edgeRoot);

        document.addEventListener("keydown", e => this.onKeyDown(e));
        emitter.on("api.cursors.ping", data => this.onRemote(data));
    }

    worldToScreen(x, y) {
        return this.stage.getAbsoluteTransform().point({ x, y });
    }

    screenToWorld(x, y) {
        return this.stage.getAbsoluteTransform().copy().invert().point({ x, y });
    }

    onKeyDown(e) {
        if ( e.code !== "Space" || e.repeat ) return;
        if ( e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) return;
        if ( e.target.closest?.("input, textarea, select, [contenteditable]") ) return;

        e.preventDefault();

        const now = performance.now();
        if ( now - this.last < COOLDOWN_MS ) return;
        this.last = now;

        const myId = usersManager.user.id;
        if ( myId === null || myId === undefined ) return;

        const p = this.stage.getRelativePointerPosition()
            || this.screenToWorld(this.stage.width() / 2, this.stage.height() / 2);

        this.show(p.x, p.y, userColor(myId));
        senderManager.send("api.cursors.ping", { x: p.x, y: p.y });
    }

    onRemote(data) {
        if ( !data || data.user === usersManager.user.id ) return;
        this.show(data.x, data.y, userColor(data.user));
    }

    show(x, y, color) {
        const s = this.worldToScreen(x, y);
        const visible = s.x >= 0 && s.y >= 0 && s.x <= this.stage.width() && s.y <= this.stage.height();

        if ( visible ) this.addRings(x, y, color);
        else this.addEdge(x, y, color);
    }

    /* Пульсация у курсора: кольца в мировых координатах, размер постоянный в пикселях экрана */
    addRings(x, y, color) {
        const scale = this.stage.scaleX() || 1;

        for ( let i = 0; i < RING_COUNT; i++ ) {
            setTimeout(() => {
                const ring = new Konva.Circle({
                    x, y,
                    radius: 10 / scale,
                    stroke: color,
                    strokeWidth: 5 / scale,
                    opacity: 0.95,
                    listening: false,
                    perfectDrawEnabled: false,
                });
                this.layer.add(ring);

                const tween = new Konva.Tween({
                    node: ring,
                    duration: 1,
                    radius: 100 / scale,
                    strokeWidth: 1 / scale,
                    opacity: 0,
                    easing: Konva.Easings.EaseOut,
                    onFinish: () => {
                        tween.destroy();
                        ring.destroy();
                    },
                });
                tween.play();
            }, i * RING_STEP_MS);
        }
    }

    /* Пульсация на краю экрана, если точка вне зоны видимости */
    addEdge(x, y, color) {
        const el = document.createElement("div");
        el.className = "ping-edge";
        el.style.setProperty("--ping-color", color);
        el.innerHTML = `<span class="ping-edge-arrow"><i class="ph ph-caret-right"></i></span>`;
        this.edgeRoot.appendChild(el);

        const edge = { el, arrow: el.firstChild, x, y, until: performance.now() + EDGE_LIFE_MS };
        this.edges.add(edge);
        this.placeEdge(edge);

        if ( !this.raf ) this.raf = requestAnimationFrame(() => this.tickEdges());
    }

    /* Точка на границе экрана по лучу от центра к цели; камера может двигаться, поэтому пересчитываем */
    placeEdge(edge) {
        const s = this.worldToScreen(edge.x, edge.y);
        const cx = this.stage.width() / 2;
        const cy = this.stage.height() / 2;
        const dx = s.x - cx;
        const dy = s.y - cy;

        const tx = Math.abs(dx) < 1e-6 ? Infinity : (cx - EDGE_MARGIN) / Math.abs(dx);
        const ty = Math.abs(dy) < 1e-6 ? Infinity : (cy - EDGE_MARGIN) / Math.abs(dy);
        const t = Math.min(1, tx, ty);

        edge.el.style.transform = `translate(${ cx + dx * t }px, ${ cy + dy * t }px)`;
        edge.arrow.style.transform = `rotate(${ Math.atan2(dy, dx) * 180 / Math.PI }deg)`;
    }

    tickEdges() {
        const now = performance.now();

        for ( const edge of this.edges ) {
            if ( now >= edge.until ) {
                edge.el.remove();
                this.edges.delete(edge);
                continue;
            }
            this.placeEdge(edge);
        }

        this.raf = this.edges.size ? requestAnimationFrame(() => this.tickEdges()) : null;
    }
}

export default PingModule;