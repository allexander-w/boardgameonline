import UIManager from "./managers/UIManager";
import NotificationsModule from "./NotificationsModule";
import HtmlGenerator from "../../core/markup/HtmlGenerator";
import {moduleManager} from "../../core";

export default {
    module: null,
    init() {
        const uiManager = new UIManager(new HtmlGenerator());
        const module = new NotificationsModule(uiManager);
        this.module = module;

        const tabsManager = moduleManager.getModule("tabs");
        tabsManager.registerTab("notificationsTab", "ph-chat-text", module.render.bind(module));

        console.log("notifications module initialized");
        this.module.notify("Модуль нотификаций инициализирован!");
    }
};