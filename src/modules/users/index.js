import {moduleManager, usersManager, senderManager, emitter} from "../../core";
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

        document.querySelector(".tab-content").addEventListener("click", (e) => {
            const button = e.target.closest(".user-action");
            if ( !button ) return;

            senderManager.send(button.dataset.action, { target: Number(button.dataset.target) });
        });

        this.module = module;
    }
}