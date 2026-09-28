import {cardsManager} from "../../../core";

class CardHandler {
    constructor(cardManager) {
        this.cardManager = cardManager;
        this.cardManager.element.on("dblclick doubletap", () => cardsManager.dispatchAction(this.cardManager, "flip"));
    }
}

export default CardHandler;