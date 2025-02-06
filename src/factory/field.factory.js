import Konva from "konva";

export const gameField = new Promise((resolve) => {
    const fieldImageObject = new Image();
    const field = new Konva.Image({
        x: - ( window.innerWidth / 2 ),
        y: - ( window.innerHeight / 2 ),
        image: fieldImageObject,
        width: 2246,
        height: 1588,
        opacity: .5
    });

    fieldImageObject.onload = () => {
        resolve(field);
    }

    fieldImageObject.src = '/fieldx4.png';
})