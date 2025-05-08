class CardsHandler {
    constructor(emitter, cardsManager, layersManager) {
        this.emitter = emitter;

        this.cardsManager = cardsManager;
        this.layersManager = layersManager;

        this.boardLayer = this.layersManager.getLayer("board");

        this.boardLayer.on("dragstart", this.cardsManager.dragstart.bind(this.cardsManager));
        this.boardLayer.on("dragmove", this.cardsManager.dragmove.bind(this.cardsManager));
        this.boardLayer.on("dragend", this.cardsManager.dragend.bind(this.cardsManager));

        this.emitter.on("api.drag.start", this.cardsManager.remoteDragstart.bind(this.cardsManager));
        this.emitter.on("api.drag.move", this.cardsManager.remoteDragmove.bind(this.cardsManager));
        this.emitter.on("api.drag.end", this.cardsManager.remoteDragend.bind(this.cardsManager));

        this.emitter.on("api.cards.action", this.cardsManager.remoteAction.bind(this.cardsManager));
    }
}

export default CardsHandler;