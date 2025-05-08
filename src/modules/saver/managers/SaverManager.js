import config from "../../../config";
import { cardsManager, moduleManager } from "../../../core";
import ResourceCard from "../../../entities/resource/ResourceCard";

class SaverManager {
    constructor(uiManager, layersManager) {
        this.uiManager = uiManager;
        this.layersManager = layersManager;


    }

    save() {
        const save = {
            timestamp: new Date(),
            project: config.scene,
            elements: [],
            resources: []
        }

        for ( const [key, card] of cardsManager.cards.entries() ) {
            const config = card.forSave;
            if ( config.resource ) save.resources.push(config);
            else save.elements.push(config);
        }

        localStorage.setItem("save", JSON.stringify(save));
        const notificationsModule = moduleManager.getModule("notifications");
        notificationsModule.notify("Игра успешно сохранена!", { color: "green" });
    }

    load() {
        const savedGame = localStorage.getItem("save");
        if ( !savedGame ) {
            const notificationsModule = moduleManager.getModule("notifications");
            notificationsModule.notify("Не удалось загрузить сохранение!", { color: "red" });
            return false;
        }

        const save = JSON.parse(savedGame);

        if ( save.project !== config.scene ) {
            const notificationsModule = moduleManager.getModule("notifications");
            notificationsModule.notify("Не удалось загрузить сохранение!", { color: "red" });
            return false;
        }

        for ( const el of save.resources ) {
            if ( cardsManager.cards.has(el.id) ) return false;
            const options =  { draggable: true, x: el.x, y: el.y, width: el.width, height: el.height, opacity: 1, id: el.id };
            const resourceCard = new ResourceCard({ front: el.src }, options);
            cardsManager.createCard(resourceCard);
        }

        for ( const el of save.elements ) {
            const card = cardsManager.getCard(el.id);
            card.forLoad(el);
        }

        const notificationsModule = moduleManager.getModule("notifications");
        notificationsModule.notify("Сохранение успешно загружено!", { color: "green" });
    }

    render() {
        return this.uiManager.getSaveMenu();
    }
}

export default SaverManager;