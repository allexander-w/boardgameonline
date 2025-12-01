import Konva from "konva";
import {objectFit, objectFitCenter} from "../utils/objectFit";
import { emitter } from "../core";

export const duosideElement = (options) => {
        const el = new Konva.Rect({
            x: 0,
            y: 0,
            offsetX: (options.width || 120) / 2,
            offsetY: (options.height || 120) / 2,
            width: 120,
            height: 120,
            fillPatternRepeat: "no-repeat",
            cornerRadius: 30,
            draggable: true,
            flipped: false,
            perfectDrawEnabled: false,

            ...options
        });

        el.flipped = (flipped) => {
            if ( flipped === undefined ) return el.attrs.flipped;
            el.attrs.flipped = flipped;
        }

        return el;
}

export const diceElement = (options = {}) => {
    return new Konva.Rect({
        x: -120,
        y: -120,
        offsetX: (options.width || 100) / 2,
        offsetY: (options.height || 100) / 2,
        width: 100,
        height: 100,
        fillPatternRepeat: "no-repeat",
        cornerRadius: 10,
        draggable: true,


        ...options
    });
}

export const loadImageDuosideElement = (duoside, src, isSprite) => (new Promise((resolve) => {
    emitter.emit("screen.preloader.loading", src);
    const image = new Image();

    image.onload = () => {
        const { scale, offset } = objectFit(duoside, image, isSprite);
        duoside.fillPatternScale({ x: scale, y: scale });
        duoside.fillPatternOffset(offset);

        duoside.fillPatternImage(image);

        emitter.emit("screen.preloader.loaded", src);
        resolve(image);
    }

    image.onerror = () => {
        emitter.emit("screen.preloader.loaded", null);
    }

    image.src = src;
}))