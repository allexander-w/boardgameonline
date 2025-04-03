import Camera from "./Camera";
import KeyboardController from "./controllers/KeyboardController";
import MouseController from "./controllers/MouseController";
import { layersManager, moduleManager } from "../../core";


export default {
    module: null,
    init() {
        console.log("camera module initialized");

        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль камеры инициализирован!");

        this.module = new Camera(layersManager, KeyboardController, MouseController);
    }
};