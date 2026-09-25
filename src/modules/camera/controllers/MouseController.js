class MouseController {
    constructor(camera) {
        this.camera = camera;
        this.stage = camera.stage;
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

        const pointer = this.stage.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - this.stage.x()) / oldScale,
            y: (pointer.y - this.stage.y()) / oldScale,
        };

        const rawScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        const newScale = this.camera.clampScale(rawScale);

        if ( newScale === oldScale ) return;

        this.stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        this.stage.position(newPos);
        this.stage.batchDraw();
    }
}

export default MouseController;