import Konva from "konva";

export const heapField = (options) => {
    const field = new Konva.Rect({
        x: 1000,
        y: 200,

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

    return field;
}


export const heapText = (count, options) => {
    return new Konva.Text({
        x: options.x || 1000,
        y: options.y - 20 || 180,
        text: count,
        fontSize: 20,
        fontFamily: "Tahoma",
        fontStyle: "bold",
        fill: "rgb(255,255,255)",
    });
}