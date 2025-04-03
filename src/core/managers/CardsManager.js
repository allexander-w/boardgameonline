import Konva from "konva";

class CardsManager {
    constructor(layersManager) {
        this.layersManager = layersManager;
        this.boardLayer = this.layersManager.getLayer("board");

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

    dragstart(e) {
        const card = this.getCard(e.target.id());
        if ( card ) card.dragstart();
    }

    dragend(e) {
        const card = this.getCard(e.target.id());
        if ( card ) card.dragend();
    }
}

export default CardsManager;