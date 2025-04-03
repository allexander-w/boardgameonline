import UIManager from "./managers/UIManager";
import HtmlGenerator from "../../core/markup/HtmlGenerator";
import ActionsModule from "./ActionsModule";
import {cardsManager, layersManager, moduleManager} from "../../core";
import ActionsHandler from "./handlers/ActionsHandler";

export default {
    module: null,
    init() {
        const uiManager = new UIManager(new HtmlGenerator());
        const actionsModule = new ActionsModule(uiManager, cardsManager);
        new ActionsHandler(actionsModule, layersManager, moduleManager);

        this.module = actionsModule;
        console.log("actions module initialized");
        // this.module.notify("Модуль нотификаций инициализирован!");
    }
};