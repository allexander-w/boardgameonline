import Camera from "./Camera";
import KeyboardController from "./controllers/KeyboardController";
import MouseController from "./controllers/MouseController";
import { layersManager } from "../../core";

export default {
    module: null,
    init() {
        console.log("camera module initialized");
        this.module = new Camera(layersManager, KeyboardController, MouseController);
    }
};