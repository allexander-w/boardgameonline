import InteractionSnapshot from "./InteractionSnapshot";
import LodController from "./LodController";
import {cardsManager, gameManager} from "../../core";
import CameraPresets from "./CameraPresets";

class Camera {
    constructor(layersManager, KeyboardController, MouseController, MobileJoystick) {
        this.stage = layersManager.stage;
        this.boardLayer = layersManager.getLayer("board");

        /* На большом числе карт подменяет отрисовку снимком, пока камера движется */
        this.interaction = new InteractionSnapshot(layersManager);

        /* Превью-текстуры, когда карты на экране маленькие */
        this.lod = new LodController(layersManager);
        this.interaction.beforeFinish = () => this.lod.update();
        this.lod.isBusy = () => this.interaction.active || !!cardsManager.activeGroup;

        this.baseScale = 1;
        this.minScale = 0.1;
        this.maxScale = 30;

        this.keyboardController = new KeyboardController(this);
        this.mouseController = new MouseController(this);

        if ('ontouchstart' in window) {
            new MobileJoystick(this);
        }

        this.initializeCamera();
        this.presets = new CameraPresets(this, gameManager.cameraViews);

        this.lod.update();

        this.keyboardController.setupKeyboardListeners();
        this.mouseController.setupMouseListeners();
    }

    /* Любое движение камеры: снимок доски (много карт) или отложенный LOD (мало карт) */
    moved() {
        this.interaction.touch();
        if ( !this.interaction.active ) this.lod.schedule();
    }

    move(dx, dy) {
        this.moved();
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
        this.maxScale = scale * 10;

        this.stage.scale({ x: scale, y: scale });
        this.stage.position({
            x: window.innerWidth / 2 - centerX * scale,
            y: window.innerHeight / 2 - centerY * scale,
        });
    }

    getView() {
        const center = this.stage.getAbsoluteTransform().copy().invert()
            .point({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

        return { x: center.x, y: center.y, zoom: this.stage.scaleX() / this.baseScale };
    }

    setView({ x, y, zoom }) {
        this.moved();

        const scale = this.clampScale(zoom * this.baseScale);
        this.stage.scale({ x: scale, y: scale });
        this.stage.position({ x: 0, y: 0 });

        const p = this.stage.getAbsoluteTransform().point({ x, y });
        this.stage.position({
            x: window.innerWidth / 2 - p.x,
            y: window.innerHeight / 2 - p.y,
        });
        this.stage.batchDraw();
    }

    zoom(factor, pointer) {
        this.moved();
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