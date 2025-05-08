import UIManager from "./managers/UIManager";
import CardHandler from "./handlers/CardHandler";
import CardManager from "./managers/CardManager";
import InterfaceCard from "../../../../entities/InterfaceCard";

class StateCard extends InterfaceCard {
    constructor(src, options) {
        super();

        this.src = src;

        this.uiManager = new UIManager();
        this.cardManager = new CardManager(src, options, this.uiManager);
        this.cardHandler = new CardHandler(this.cardManager);
    }

    get element() {
        return this.cardManager.element;
    }

    dragstart() {
        this.uiManager.dragstart(this.element);
    }

    dragend() {
        this.uiManager.dragend(this.element);
    }

    get options() {
        return [
            { method: "change", name: "Сменить" }
        ]
    }

    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            zIndex: this.element.zIndex(),
            rotation: this.element.rotation(),
            id: this.element.id(),

            index: this.cardManager.index,
        }
    }

    forLoad(options) {
        this.element.x(options.x);
        this.element.y(options.y);
        this.element.id(options.id);
        this.element.zIndex(options.zIndex);
        this.element.rotation(options.rotation);

        this.cardManager.index = parseInt(options.index);
        this.uiManager.changeImage(this.element, this.cardManager.images[parseInt(options.index)]);
    }
}

export default StateCard;