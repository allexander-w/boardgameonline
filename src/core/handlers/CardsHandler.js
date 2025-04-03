class CardsHandler {
    constructor(emitter, cardsManager, layersManager) {
        this.emitter = emitter;

        this.cardsManager = cardsManager;
        this.layersManager = layersManager;

        this.boardLayer = this.layersManager.getLayer("board");

        this.boardLayer.on("dragstart", this.cardsManager.dragstart.bind(this.cardsManager));
        this.boardLayer.on("dragend", this.cardsManager.dragend.bind(this.cardsManager));

        this.emitter.on("cards.drag.start", this.cardsManager.dragstart.bind(this.cardsManager));
    }
}

export default CardsHandler;