import Konva from "konva";

export const gameField = new Promise((resolve) => {
    const fieldImageObject = new Image();
    const field = new Konva.Image({
        x: 0,
        y: 0,
        image: fieldImageObject,
        width: 1902,
        height: 1474,
        opacity: 0.8
    });

    fieldImageObject.onload = () => {
        resolve(field);
    }

    fieldImageObject.src = '/scythe/field.png';
})