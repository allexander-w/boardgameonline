import {duosideElement, loadImageDuosideElement} from "../../../factory/cards.factory";
import Konva from "konva";

class UIManager {
    constructor() {
        /* Картинки рубашки и карточки */
        this.background = new Image();
        this.front = new Image();
    }


    createElement(options) {
        return duosideElement(options);
    }

    createSideImages(el, src) {
        loadImageDuosideElement(el, src.front).then(image => {
            this.front = image
            loadImageDuosideElement(el, src.bg).then(image => this.background = image);
        });
    }

    setFrontImage(el) {
        el.fillPatternImage(this.front);
    }

    setBackImage(el) {
        el.fillPatternImage(this.background);
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