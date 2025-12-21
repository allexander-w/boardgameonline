import {moduleManager, usersManager, emitter} from "../../core";
import UsersManager from "./managers/UsersManager";
import UIManager from "./managers/UIManager";
import UsersHandler from "./handlers/UsersHandler";

export default {
    module: null,
    init() {
        const notificationsManager = moduleManager.getModule("notifications");
        const tabsManager = moduleManager.getModule("tabs");

        notificationsManager.notify("Модуль пользователей инициализирован!");
        console.log("Модуль пользователей инициализирован");

        const uiManager = new UIManager();
        const module = new UsersManager(usersManager, uiManager);
        new UsersHandler(tabsManager, uiManager, emitter);

        tabsManager.registerTab("usersTab", "ph-user-list", module.render.bind(module));

        this.module = module;
    }
}