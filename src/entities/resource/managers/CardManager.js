import {cardsManager, senderManager} from "../../../core";

class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.uiManager.createSideImages(this.element, src);
    }

    putAway(ws) {
        this.element.off();
        this.element.remove();
        this.element.destroy();
        cardsManager.removeCard(this.element.id());

        if ( ws && ws.server ) return false;
        senderManager.send("api.cards.action", { method: 'putAway', id: this.element.id() });
    }

}

export default CardManager;