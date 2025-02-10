import Konva from "konva";
import {loadSVG} from "../utils/loader";
import {objectFitCenter} from "../utils/objectFit";

export const buttonElement = (options, src) => {
    const btn = new Konva.Rect({
        x: (options.x || 0) - 30,
        y: options.y || 0,
        width: 24,
        height: 24,
        stroke: "rgb(255,255,255)",

        fillPatternRepeat: "no-repeat",

        cornerRadius: 4,
        draggable: false,
    });

    loadSVG(src, (image) => {
        const { scale, offset } = objectFitCenter(btn, image, 2);

        btn.fillPatternScale({ x: scale, y: scale });
        btn.fillPatternOffset(offset);
        btn.fillPatternImage(image);
    });

    return btn;
}