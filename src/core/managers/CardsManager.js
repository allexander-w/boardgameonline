class CardsManager {
    constructor(layersManager, senderManager) {
        this.layersManager = layersManager;
        this.senderManager = senderManager;

        this.boardLayer = this.layersManager.getLayer("board");
        this.boardStage = this.layersManager.stage;

        this.cards = new Map();
    }

    getCard(id) {
        return this.cards.get(id);
    }

    getElement(id, layer) {
        layer = layer ? this.layersManager.getLayer(layer) : this.boardLayer;
        return layer.findOne("#" + id);
    }

    createCard(card, layer) {
        layer = layer ? this.layersManager.getLayer(layer) : this.boardLayer;

        layer.add(card.element);
        this.cards.set(card.element.id(), card);
    }

    removeCard(id) {
        this.cards.delete(id);
    }

    dragmove(element) {
        const pointerPos = this.boardLayer.getRelativePointerPosition();

        this.senderManager.send("api.drag.move", { x: element.target.x(), y: element.target.y(), id: element.target.id() });
        this.senderManager.send("api.cursors.move", { x: pointerPos.x, y: pointerPos.y });
    }

    remoteDragmove(data) {
        const card = this.getCard(data.id);
        if ( card ) {
            card.element.x(data.x);
            card.element.y(data.y);
        }
    }

    dragstart(e) {
        const card = this.getCard(e.target.id());
        if ( !card ) return false;

        card.dragstart();
        this.senderManager.send("api.drag.start", { id: e.target.id() });
    }

    remoteDragstart(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        card.dragstart();
    }

    dragend(e) {
        const card = this.getCard(e.target.id());
        if ( !card ) return false;

        card.dragend();
        this.senderManager.send("api.drag.end", { id: e.target.id() });
    }

    remoteDragend(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        card.dragend();
    }

    remoteAction(data) {
        const card = this.getCard(data.id);
        if ( !card ) return false;

        if ( card.cardManager && card.cardManager[data.method] ) {
            card.cardManager[data.method]({ server: true }, data.payload);
        }
    }
}

export default CardsManager;