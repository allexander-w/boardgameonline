import TabsModule from "./TabsModule";
import TabsHandler from "./handlers/TabsHandler";
import UIManager from "./managers/UIManager";
import {cardsManager, layersManager, moduleManager, emitter} from "../../core";
import HtmlGenerator from "../../core/markup/HtmlGenerator";


export default {
    module: null,
    init() {
        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль табов инициализирован!");
        console.log("tabs module initialized");

        const uiManager = new UIManager(new HtmlGenerator());
        const module = new TabsModule(uiManager, emitter);
        const handler = new TabsHandler(module, uiManager);

        this.module = module;
    }
};