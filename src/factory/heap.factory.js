import Konva from "konva";

export const heapField = (options) => {
    return new Konva.Rect({
        x: 0,
        y: 0,
        width: 280,
        height: 200,
        fill: "rgba(255,255,255, 0.05)",
        stroke: "rgb(255,255,255)",
        dash: [10, 6],
        strokeWidth: 3,
        cornerRadius: 20,
        draggable: false,

        ...options
    });
}


export const heapText = (count, options) => {
    return new Konva.Text({
        x: options.x || 0,
        y: (options.y - 20) || 0,
        text: count,
        fontSize: 20,
        fontFamily: "Tahoma",
        fontStyle: "bold",
        fill: "rgb(255,255,255)",
    });
}