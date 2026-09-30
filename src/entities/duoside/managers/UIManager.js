import {duosideElement, loadImageDuosideElement} from "../../../factory/cards.factory";
import Konva from "konva";
import config from "../../../config";
import {layersManager} from "../../../core";

import {THUMB_WIDTH, residentFulls, thumbFor, loadFull} from "./TextureStore";

/* Гистерезис, чтобы текстура не мигала на границе порога */
const THUMB_HYSTERESIS = 1.15;

class UIManager {
    constructor() {
        /* Картинки рубашки и карточки */
        this.background = new Image();
        this.front = new Image();

        /* Превью, адреса полных картинок и масштаб (заполняются после загрузки) */
        this.el = null;
        this.urls = null;
        this.frontThumb = null;
        this.backThumb = null;
        this.fit = null;
        this.low = false;

        this.pending = { front: false, back: false };
        this.lastUsed = 0;
    }

    /* Карта загружена и готова к переключению текстур */
    get ready() {
        return !!this.fit;
    }


    createElement(options) {
        return duosideElement(options);
    }

    createSideImages(el, src) {
        this.el = el;
        this.urls = { front: config.s3BaseUrl(src.front), back: config.s3BaseUrl(src.bg) };

        loadImageDuosideElement(el, this.urls.front).then(image => {
            this.front = image;
            this.frontThumb = thumbFor(this.urls.front, image);

            loadImageDuosideElement(el, this.urls.back).then(image => {
                this.background = image;
                this.backThumb = thumbFor(this.urls.back, image);

                /* Масштаб/смещение, которые loader выставил для полной текстуры */
                this.fit = { scale: { ...el.fillPatternScale() }, offset: { ...el.fillPatternOffset() } };

                /* Полные картинки сразу выгружаем: какие нужны, решит LodController по камере */
                this.low = true;
                this._dropFull();
                this._paint(el, el.flipped());
            });
        });
    }

    /* Нужна ли сейчас превью-текстура (по текущему масштабу сцены) */
    wantsLow(el) {
        const screenWidth = el.width() * layersManager.stage.scaleX() * (Konva.pixelRatio || window.devicePixelRatio || 1);
        return screenWidth <= THUMB_WIDTH * (this.low ? THUMB_HYSTERESIS : 1);
    }

    /* Переключение превью/полная. Возвращает true, если режим поменялся */
    setLod(el, low) {
        if ( !this.fit || this.low === low ) return false;

        this.low = low;
        if ( low ) this._dropFull();
        this._paint(el, el.flipped());
        return true;
    }

    hasFull(front) {
        return !!(front ? this.front : this.background);
    }

    touch(tick) {
        this.lastUsed = tick;
    }

    /* Подгрузить полную картинку той стороны, которая сейчас показана */
    requestFull(front) {
        const key = front ? "front" : "back";
        if ( !this.urls || this.pending[key] ) return;

        this.pending[key] = true;

        loadFull(this.urls[key], () => this.low).then(image => {
            this.pending[key] = false;
            if ( !image || this.low ) return;

            if ( front ) this.front = image;
            else this.background = image;
            residentFulls.add(this);

            if ( this.el.flipped() === front ) {
                this._paint(this.el, front);
                layersManager.stage.batchDraw();
            }
        });
    }

    releaseFull() {
        this._dropFull();
        this._paint(this.el, this.el.flipped());
    }

    _dropFull() {
        this.front = null;
        this.background = null;
        residentFulls.delete(this);
    }

    _paint(el, front) {
        const full = front ? this.front : this.background;
        const thumb = front ? this.frontThumb : this.backThumb;

        if ( full && !this.low ) {
            el.fillPatternImage(full);
            if ( this.fit ) {
                el.fillPatternScale(this.fit.scale);
                el.fillPatternOffset(this.fit.offset);
            }
            return;
        }

        if ( thumb && this.fit ) {
            /* Тот же внешний вид, что у полной текстуры: масштаб и смещение пересчитаны под размер превью */
            el.fillPatternImage(thumb);
            el.fillPatternScale({
                x: this.fit.scale.x * thumb.srcWidth / thumb.width,
                y: this.fit.scale.y * thumb.srcHeight / thumb.height,
            });
            el.fillPatternOffset({
                x: this.fit.offset.x * thumb.width / thumb.srcWidth,
                y: this.fit.offset.y * thumb.height / thumb.srcHeight,
            });
            return;
        }

        if ( full ) el.fillPatternImage(full);
    }

    /* После переворота новая сторона может быть только в превью - догружаем полную */
    _wantFull(el, front) {
        if ( this.fit && !this.low && !this.hasFull(front) && el.isVisible() ) this.requestFull(front);
    }

    setFrontImage(el) {
        this._paint(el, true);
        this._wantFull(el, true);
    }

    setBackImage(el) {
        this._paint(el, false);
        this._wantFull(el, false);
    }

    setRotateDeg(el, deg) {
        el.rotation(deg);
    }

    getFlipAnimation(el, cb) {
        return new Konva.Tween({
            node: el,
            duration: 0.2,
            scaleX: 0,
            scaleY: 1.2,
            onFinish: () => {
                cb();

                new Konva.Tween({
                    node: el,
                    duration: 0.2,
                    scaleY: 1,
                    scaleX: 1,
                }).play();
            },
        });
    }

    dragstart(el) {
        el.to({
            scaleX: 1.05,
            scaleY: 1.05,
            shadowColor: "rgba(0, 0, 0, 0.9)",
            shadowBlur: 20,
            shadowOpacity: 1,

            duration: 0.03,
            easing: Konva.Easings.EaseOut
        });

        el.moveToTop();
    }

    dragend(el) {
        el.to({
            scaleX: 1,
            scaleY: 1,
            shadowColor: "rgba(0, 0, 0, 0)",
            shadowBlur: 0,
            shadowOpacity: 0,

            duration: 0.1,
            easing: Konva.Easings.EaseIn
        });
    }
}

export default UIManager;