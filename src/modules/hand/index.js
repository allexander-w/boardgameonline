import HandManager from "./managers/HandManager";
import HandHandler from "./handlers/HandHandler";
import UIManager from "./managers/UIManager";
import {cardsManager, layersManager, moduleManager, emitter} from "../../core";

export default {
    module: null,
    init() {
        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль хранения инициализирован!");
        console.log("hands module initialized");

        const ui = new UIManager();
        const manager = new HandManager(layersManager, cardsManager, moduleManager, ui);
        new HandHandler(manager, layersManager, emitter);

        this.module = manager;
    }
};