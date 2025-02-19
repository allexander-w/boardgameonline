import Konva from "konva";

export const gameField = (src, options = {}) => new Promise((resolve) => {
    const fieldImageObject = new Image();
    const field = new Konva.Image({
        x: 0,
        y: 0,
        image: fieldImageObject,
        width: 3012,
        height: 2422,
        opacity: 1,

        ...options
    });

    fieldImageObject.onload = () => {
        resolve(field);
    }

    fieldImageObject.src = src || '/vine/field.jpg';
})