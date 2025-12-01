const gridSize = 150;

export default function createPattern() {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = gridSize;
    patternCanvas.height = gridSize;
    const ctx = patternCanvas.getContext("2d");

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;

    // Вертикальная линия
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, gridSize);
    ctx.stroke();

    // Горизонтальная линия
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(gridSize, 0);
    ctx.stroke();

    return patternCanvas;
}