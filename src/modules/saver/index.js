import {moduleManager, layersManager, emitter} from "../../core";
import HtmlGenerator from "../../core/markup/HtmlGenerator";
import SaverUIManager from "./managers/SaverUIManager";
import SaverManager from "./managers/SaverManager";
import SaverHandler from "./handlers/SaverHandler";

export default {
    module: null,
    init(config) {
        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль Сохранений инициализирован!");
        const tabsManager = moduleManager.getModule("tabs");

        console.log("Модуль сохранений инициализирован");

        const uiManager = new SaverUIManager(new HtmlGenerator());
        const module = new SaverManager(uiManager, layersManager);

        new SaverHandler(uiManager, module, emitter);

        tabsManager.registerTab("saverTab", "ph-gear", module.render.bind(module));

        this.module = module;
    }
}