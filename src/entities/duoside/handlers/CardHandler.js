class CardHandler {
    constructor(cardManager) {
        this.cardManager = cardManager;
        this.cardManager.element.on("dblclick doubletap", this.cardManager.flip.bind(this.cardManager));
    }
}

export default CardHandler;