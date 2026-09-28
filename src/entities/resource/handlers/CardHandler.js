import {cardsManager} from "../../../core";

class CardHandler {
    constructor(cardManager) {
        this.cardManager = cardManager;
        this.cardManager.element.on("dblclick", () => cardsManager.dispatchAction(this.cardManager, "putAway"));
    }
}

export default CardHandler;