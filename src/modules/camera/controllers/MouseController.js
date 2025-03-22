class MouseController {
    constructor(stage) {
        this.stage = stage;
    }

    setupMouseListeners() {
        this.stage.on("wheel", (e) => this.handleZoom(e));
        this.stage.on("mousedown", () => this.stage.draggable(true));
        this.stage.on("mouseup", () => this.stage.draggable(false));
    }

    handleZoom(e) {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const oldScale = this.stage.scaleX();

        // Определяем новый масштаб
        const pointer = this.stage.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - this.stage.x()) / oldScale,
            y: (pointer.y - this.stage.y()) / oldScale,
        };

        const newScale =
            e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        this.stage.scale({ x: newScale, y: newScale });

        // Обновляем позицию, чтобы зум происходил относительно указателя мыши
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        this.stage.position(newPos);
        this.stage.batchDraw();
    }
}

export default MouseController;