class Camera {
    constructor(layersManager, KeyboardController, MouseController, MobileJoystick) {
        this.stage = layersManager.stage;
        this.boardLayer = layersManager.getLayer("board");

        this.baseScale = 1;
        this.minScale = 0.1;
        this.maxScale = 30;

        this.keyboardController = new KeyboardController(this);
        this.mouseController = new MouseController(this);

        if ('ontouchstart' in window) {
            new MobileJoystick(this);
        }

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

    clampScale(scale) {
        return Math.min(this.maxScale, Math.max(this.minScale, scale));
    }

    initializeCamera() {
        const rect = this.stage.getClientRect();
        const width = rect.width || 1;
        const height = rect.height || 1;

        const centerX = rect.x + width / 2;
        const centerY = rect.y + height / 2;

        const scale = Math.min(window.innerWidth / width, window.innerHeight / height);

        this.baseScale = scale;
        this.minScale = scale * 0.1;
        this.maxScale = scale * 1;

        this.stage.scale({ x: scale, y: scale });
        this.stage.position({
            x: window.innerWidth / 2 - centerX * scale,
            y: window.innerHeight / 2 - centerY * scale,
        });
    }

    zoom(factor, pointer) {
        const oldScale = this.stage.scaleX();
        const newScale = this.clampScale(factor > 0 ? oldScale / 1.1 : oldScale * 1.1);
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