import {moduleManager, layersManager, emitter} from "../../core";
import ResourcesUIManager from "./managers/ResourcesUIManager";
import ResourcesManger from "./managers/ResourcesManger";
import ResourcesHandler from "./handlers/ResourcesHandler";
import HtmlGenerator from "../../core/markup/HtmlGenerator";

export default {
    module: null,
    init(config) {
        const notificationsManager = moduleManager.getModule("notifications");
        const tabsManager = moduleManager.getModule("tabs");

        notificationsManager.notify("Модуль ресурсов инициализирован!");
        console.log("Модуль ресурсов инициализирован");

        const uiManager = new ResourcesUIManager(new HtmlGenerator());
        const module = new ResourcesManger(config, uiManager);
        new ResourcesHandler(module, uiManager, emitter, layersManager);


        tabsManager.registerTab("resourcesTab", "Ресурсы", module.render.bind(module));
        this.module = module;
    }
}