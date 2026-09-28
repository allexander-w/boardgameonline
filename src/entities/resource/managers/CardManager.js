import {cardsManager} from "../../../core";

class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.uiManager.createSideImages(this.element, src);
    }

    putAway() {
        this.element.off();
        this.element.remove();
        this.element.destroy();
        cardsManager.removeCard(this.element.id());
    }

}

export default CardManager;