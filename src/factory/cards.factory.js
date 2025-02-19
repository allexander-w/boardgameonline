import Konva from "konva";
import CARD_DEFAULTS from "../defaults/cards.defaults";
import {objectFit, objectFitCenter} from "../utils/objectFit";
import ws from "../core/websocket";

export const duosideElement = (options) => {
        const el = new Konva.Rect({
            x: 0,
            y: 0,
            offsetX: ( options.width || CARD_DEFAULTS.WIDTH ) / 2,
            offsetY: ( options.height || CARD_DEFAULTS.HEIGHT ) / 2,
            width: CARD_DEFAULTS.WIDTH,
            height: CARD_DEFAULTS.HEIGHT,
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