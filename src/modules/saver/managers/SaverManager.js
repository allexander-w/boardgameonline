import config from "../../../config";
import { cardsManager, moduleManager, syncHandler } from "../../../core";
import { applySave } from "../../../core/initialize/applySave";

class SaverManager {
    constructor(uiManager, layersManager) {
        this.uiManager = uiManager;
        this.layersManager = layersManager;
    }

    _notify(text, color) {
        const notificationsModule = moduleManager.getModule("notifications");
        notificationsModule.notify(text, { color });
    }

    save() {
        // const save = {
        //     timestamp: new Date(),
        //     project: config.scene,
        //     elements: [],
        //     resources: []
        // }
        //
        // for ( const [key, card] of cardsManager.cards.entries() ) {
        //     const data = card.forSave;
        //     if ( data.resource ) save.resources.push(data);
        //     else save.elements.push(data);
        // }
        //
        // localStorage.setItem("save", JSON.stringify(save));
        // this._notify("Игра успешно сохранена!", "green");

        syncHandler.checkpoint();
        this._notify("Игра сохранена на сервере!", "green");
    }

    load() {
        const savedGame = localStorage.getItem("save");
        if ( !savedGame ) {
            this._notify("Не удалось загрузить сохранение!", "red");
            return false;
        }

        const save = JSON.parse(savedGame);

        if ( save.project !== config.scene ) {
            this._notify("Не удалось загрузить сохранение!", "red");
            return false;
        }

        // Единая точка загрузки: создаёт/обновляет карты и ресурсы,
        // затем восстанавливает привязки зон (zoneManager.restoreAll)
        applySave(save);

        this._notify("Сохранение успешно загружено!", "green");
    }

    render() {
        return this.uiManager.getSaveMenu();
    }
}

export default SaverManager;