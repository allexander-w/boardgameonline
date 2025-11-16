import {moduleManager, layersManager, emitter} from "../../../../core";
import HtmlGenerator from "../../../../core/markup/HtmlGenerator";
import {DrawModule} from "./DrawModule";


export default {
    module: null,
    init(config) {
        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Модуль Сохранений инициализирован!");

        console.log("Модуль рисования стрелок инициализирован");

        this.module = new DrawModule({});
    }
}