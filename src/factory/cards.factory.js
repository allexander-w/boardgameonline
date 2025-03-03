import Konva from "konva";
import {objectFit, objectFitCenter} from "../utils/objectFit";
import ws from "../core/websocket";

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
            prevPosition: { x: options.x || 0, y: options.y || 0 },
            flipped: false,

            ...options
        });

        el.prevPosition = (coordinates) => {
            if ( !coordinates ) return el.attrs.prevPosition;
            el.attrs.prevPosition = coordinates;
        }

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
    ws.emitter.emit("loading", src);
    const image = new Image();


    image.onload = () => {
        const { scale, offset } = objectFit(duoside, image, isSprite);
        duoside.fillPatternScale({ x: scale, y: scale });
        duoside.fillPatternOffset(offset);

        duoside.fillPatternImage(image);
        ws.emitter.emit("loaded", src);
        resolve(image);
    }

    image.onerror = () => {
        ws.emitter.emit("loaded", null);
    }

    image.src = src;
}))