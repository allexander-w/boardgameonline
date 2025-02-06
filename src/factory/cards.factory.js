import Konva from "konva";
import CARD_DEFAULTS from "../defaults/cards.defaults";
import { objectFit } from "../utils/objectFit";

export const duosideElement = (options) => {
        return new Konva.Rect({
            x: 0,
            y: 0,
            offsetX: ( options.width || CARD_DEFAULTS.WIDTH ) / 2,
            offsetY: ( options.height || CARD_DEFAULTS.HEIGHT ) / 2,
            width: CARD_DEFAULTS.WIDTH,
            height: CARD_DEFAULTS.HEIGHT,
            cornerRadius: 30,

            // shadowColor: "rgba(255, 255, 255, 0.6)",
            // shadowBlur: 20,
            // shadowOffsetX: 0,
            // shadowOffsetY: 0,
            // shadowOpacity: 1,

            draggable: true,

            prevPosition: { x: options.x || 0, y: options.y || 0 },
            ...options
        });
}

export const loadImageDuosideElement = (duoside, src, isSprite) => (new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
        const { scale, offset } = objectFit(duoside, image, isSprite);
        duoside.fillPatternScale({ x: scale, y: scale });
        duoside.fillPatternOffset(offset);

        duoside.fillPatternImage(image);
        resolve(duoside);
    }

    image.src = src;
}))