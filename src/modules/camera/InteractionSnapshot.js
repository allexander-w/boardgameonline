import Konva from "konva";

const MAX_SIDE = 3072;   // максимальная сторона снимка в px
const IDLE_MS = 140;     // сколько ждать после последнего движения камеры

/**
 * На время зума/перемещения камеры вместо сотен карт рисуем один готовый снимок доски.
 * Когда камера остановилась - возвращаем настоящую отрисовку (одна полная перерисовка).
 * Включается только если на доске много объектов, для маленьких игр ничего не меняется.
 */
class InteractionSnapshot {
    constructor(layersManager, { minCards = 300 } = {}) {
        this.stage = layersManager.stage;
        this.boardLayer = layersManager.getLayer("board");
        this.minCards = minCards;

        this.active = false;
        this.timer = null;
        this.proxyLayer = null;
        this.proxyImage = null;
        this.snapshot = null;

        /* Вызывается перед возвратом настоящей отрисовки (например, сменить LOD текстур) */
        this.beforeFinish = null;
    }

    /* Вызывается при каждом шаге камеры */
    touch() {
        if (!this.active && !this._begin()) return;

        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.finish(), IDLE_MS);
    }

    _begin() {
        if (this.boardLayer.children.length < this.minCards) return false;

        const stage = this.stage;
        const saved = {
            scale: { ...stage.scale() },
            position: { ...stage.position() },
            rotation: stage.rotation(),
            offset: { ...stage.offset() },
        };

        let canvas = null;
        let box = null;

        /* Снимаем доску в её собственных координатах: временно сбрасываем трансформацию сцены */
        try {
            stage.scale({ x: 1, y: 1 });
            stage.position({ x: 0, y: 0 });
            stage.rotation(0);
            stage.offset({ x: 0, y: 0 });

            box = this.boardLayer.getClientRect();
            if (box.width > 0 && box.height > 0) {
                const pixelRatio = Math.min(1, MAX_SIDE / Math.max(box.width, box.height));
                canvas = this.boardLayer.toCanvas({
                    x: box.x, y: box.y, width: box.width, height: box.height, pixelRatio,
                });
            }
        } finally {
            stage.scale(saved.scale);
            stage.position(saved.position);
            stage.rotation(saved.rotation);
            stage.offset(saved.offset);
        }

        if (!canvas) return false;

        if (!this.proxyLayer) {
            this.proxyLayer = new Konva.Layer({ listening: false });
            this.proxyImage = new Konva.Image({ listening: false, perfectDrawEnabled: false });
            this.proxyLayer.add(this.proxyImage);
            this.stage.add(this.proxyLayer);
        }

        this.snapshot = canvas;
        this.proxyImage.setAttrs({ image: canvas, x: box.x, y: box.y, width: box.width, height: box.height });

        /* Прокси-слой строго под доской, чтобы порядок слоев не изменился */
        this.proxyLayer.visible(true);
        this.proxyLayer.zIndex(this.boardLayer.zIndex());
        this.boardLayer.visible(false);

        this.active = true;
        return true;
    }

    finish() {
        clearTimeout(this.timer);
        this.timer = null;
        if (!this.active) return;

        this.active = false;
        this.beforeFinish?.();

        /* Сначала настоящая отрисовка, потом прячем снимок - без мерцания */
        this.boardLayer.visible(true);
        this.boardLayer.draw();
        this.proxyLayer.visible(false);

        this.proxyImage.image(null);
        if (this.snapshot) {
            this.snapshot.width = 0;
            this.snapshot.height = 0;
            this.snapshot = null;
        }
    }
}

export default InteractionSnapshot;
