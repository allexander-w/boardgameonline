import { counterElement, loadImageCounterElement } from "../../../factory/cards.factory";
import Konva from "konva";
import config from "../../../config";

class CounterUIManager {
    constructor() {
        this.backgroundImage = new Image();
    }

    createElement(options) {
        return counterElement(options);
    }

    loadImage(group, src) {
        // const fullPath = typeof src === "string" && src.startsWith("http") ? src : config.s3BaseUrl(src);
        const fullPath = src;
        return loadImageCounterElement(group, fullPath).then((img) => {
            this.backgroundImage = img;
        });
    }

    updateText(group, value) {
        group.count(value);
        group.getLayer()?.batchDraw();
    }

    dragstart(el) {
        el.to({
            scaleX: 1.05,
            scaleY: 1.05,
            shadowColor: "rgba(0, 0, 0, 0.9)",
            shadowBlur: 20,
            shadowOpacity: 1,
            duration: 0.03,
            easing: Konva.Easings.EaseOut,
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
            easing: Konva.Easings.EaseIn,
        });
    }
}

export default CounterUIManager;