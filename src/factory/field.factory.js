import Konva from "konva";

export const gameField = new Promise((resolve) => {
    const fieldImageObject = new Image();
    const field = new Konva.Image({
        x: 0,
        y: 0,
        image: fieldImageObject,
        width: 2246,
        height: 1588,
        opacity: .8
    });

    fieldImageObject.onload = () => {
        resolve(field);
    }

    fieldImageObject.src = '/fieldx4.png';
})