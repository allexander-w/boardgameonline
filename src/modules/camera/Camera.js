class Camera {
    constructor(layersManager, KeyboardController, MouseController) {
        this.stage = layersManager.stage;
        this.boardLayer = layersManager.getLayer("board");

        this.keyboardController = new KeyboardController(this);
        this.mouseController = new MouseController(this.stage);

        this.initializeCamera();

        this.keyboardController.setupKeyboardListeners();
        this.mouseController.setupMouseListeners();
    }

    move(dx, dy) {
        this.stage.position({
            x: this.stage.x() + dx,
            y: this.stage.y() + dy,
        });
    }

    rotate(deg) {
        this.stage.rotation(this.stage.rotation() + deg);
    }

    offset({x, y}) {
        this.stage.offsetX(x);
        this.stage.offsetY(y);
    }

    initializeCamera() {
        const layoutClientRect = this.stage.getClientRect();
        const coordinates = {
            width: (layoutClientRect.x + layoutClientRect.width) || 1,
            height: (layoutClientRect.y + layoutClientRect.height) || 1
        };

        const isWidthMore = (window.innerWidth / coordinates.width >= window.innerHeight / coordinates.height);
        const scale = isWidthMore ? window.innerHeight / coordinates.height : window.innerWidth / coordinates.width;

        this.stage.scale({ x: scale, y: scale });
        this.move((window.innerWidth - (coordinates.width * scale)) / 2, 0);
    }

    zoom(factor, pointer) {
        const oldScale = this.stage.scaleX();
        const newScale = factor > 0 ? oldScale / 1.1 : oldScale * 1.1;
        const mousePointTo = {
            x: (pointer.x - this.stage.x()) / oldScale,
            y: (pointer.y - this.stage.y()) / oldScale,
        };

        this.stage.scale({ x: newScale, y: newScale });
        this.stage.position({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
        this.stage.batchDraw();
    }
}

export default Camera;