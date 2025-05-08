class CardHandler {
    constructor(cardManager) {
        this.cardManager = cardManager;
        this.cardManager.element.on("dblclick", this.cardManager.putAway.bind(this.cardManager));
    }
}

export default CardHandler;