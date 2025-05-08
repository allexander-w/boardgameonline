import {moduleManager, usersManager} from "../../core";
import UsersManager from "./managers/UsersManager";
import UIManager from "./managers/UIManager";

export default {
    module: null,
    init() {
        const notificationsManager = moduleManager.getModule("notifications");
        const tabsManager = moduleManager.getModule("tabs");

        notificationsManager.notify("Модуль пользователей инициализирован!");
        console.log("Модуль пользователей инициализирован");

        const uiManager = new UIManager();
        const module = new UsersManager(usersManager, uiManager);

        tabsManager.registerTab("usersTab", "Пользователи", module.render.bind(module));

        this.module = module;
    }
}