import Konva from "konva";

export const getFlipAnimation = (el, cb) => {
    return new Konva.Tween({
        node: el,
        duration: 0.2,
        scaleX: 0,
        scaleY: 1.2,
        onFinish: () => {
            cb();

            new Konva.Tween({
                node: el,
                duration: 0.2,
                scaleY: 1,
                scaleX: 1,
            }).play();
        },
    });
}