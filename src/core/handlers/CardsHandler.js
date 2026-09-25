class CardsHandler {
    constructor(emitter, cardsManager, layersManager) {
        this.emitter = emitter;
        this.cardsManager = cardsManager;
        this.layersManager = layersManager;

        this.boardLayer = this.layersManager.getLayer("board");

        // 1. Стандартные Drag&Drop события Konva
        this.boardLayer.on("dragstart", this.cardsManager.dragstart.bind(this.cardsManager));
        this.boardLayer.on("dragmove", this.cardsManager.dragmove.bind(this.cardsManager));
        this.boardLayer.on("dragend", this.cardsManager.dragend.bind(this.cardsManager));

        // 2. Новые события для удержания (Long Press / Группировки стопки)
        this.boardLayer.on("pointerdown", this.cardsManager.onPointerDown.bind(this.cardsManager));
        this.boardLayer.on("pointermove", this.cardsManager.onPointerMove.bind(this.cardsManager));
        this.boardLayer.on("pointerup pointerrelease", this.cardsManager.onPointerUp.bind(this.cardsManager));

        // 3. Сетевые события (Emitter)
        this.emitter.on("api.drag.start", this.cardsManager.remoteDragstart.bind(this.cardsManager));
        this.emitter.on("api.drag.move", this.cardsManager.remoteDragmove.bind(this.cardsManager));
        this.emitter.on("api.drag.end", this.cardsManager.remoteDragend.bind(this.cardsManager));

        // Новые сетевые события для перемещения всей стопки
        this.emitter.on("api.drag.stackMove", this.cardsManager.remoteStackMove.bind(this.cardsManager));
        this.emitter.on("api.drag.stackEnd", this.cardsManager.remoteStackEnd.bind(this.cardsManager));

        this.emitter.on("api.cards.action", this.cardsManager.remoteAction.bind(this.cardsManager));
    }
}

export default CardsHandler;