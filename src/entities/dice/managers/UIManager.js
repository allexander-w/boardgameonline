import {duosideElement, loadImageDuosideElement} from "../../../factory/cards.factory";
import Konva from "konva";

class UIManager {

    createElement(options) {
        return duosideElement(options);
    }

    createSideImages(el, src) {
        loadImageDuosideElement(el, src.front, 6);
    }

    getRollAnimation(el, cb) {
        return new Konva.Tween({
            node: el,
            duration: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            rotation: 1200,
            shadowColor: "rgba(0, 0, 0, 0.9)",
            shadowBlur: 20,
            shadowOpacity: 1,

            onFinish: () => {
                cb();

                new Konva.Tween({
                    node: el,
                    duration: 0.1,
                    rotation: 0,
                    scaleY: 1,
                    scaleX: 1,
                    shadowColor: "rgba(0, 0, 0, 0)",
                    shadowBlur: 0,
                    shadowOpacity: 0,
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