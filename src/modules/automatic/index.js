import {moduleManager, layersManager, emitter} from "../../core";
import {AutomaticsManager} from "./managers/AutomaticsManager";
// import HtmlGenerator from "../../core/markup/HtmlGenerator";
// import SaverUIManager from "./managers/SaverUIManager";
// import SaverManager from "./managers/SaverManager";
// import SaverHandler from "./handlers/SaverHandler";

export default {
    module: null,
    init(config) {
        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль автоматизации инициализирован!");


        this.module = new AutomaticsManager(layersManager)
        // const uiManager = new SaverUIManager(new HtmlGenerator());
        // const module = new SaverManager(uiManager, layersManager);
        //
        // new SaverHandler(uiManager, module, emitter);
        //
        // tabsManager.registerTab("saverTab", "Меню", module.render.bind(module));
    }
}