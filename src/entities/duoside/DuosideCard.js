import UIManager from "./managers/UIManager";
import CardHandler from "./handlers/CardHandler";
import CardManager from "./managers/CardManager";
import InterfaceCard from "../InterfaceCard";

class DuosideCard extends InterfaceCard {
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
            { method: "flip", name: "Перевернуть" },
            { method: "rotateLeft", name: "Повернуть влево" },
            { method: "rotateRight", name: "Повернуть вправо" },
            { method: "toBottom", name: "Вниз колоды" },
            { method: "toTop", name: "Вверх колоды" },
        ]
    }

    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            zIndex: this.element.zIndex(),
            rotation: this.element.rotation(),
            id: this.element.id(),

            flipped: this.element.flipped(),
        }
    }

    forLoad(options) {
        this.element.x(options.x);
        this.element.y(options.y);
        this.element.id(options.id);
        this.element.zIndex(options.zIndex);
        this.element.rotation(options.rotation);

        options.flipped ? this.cardManager.flipFront() : this.cardManager.flipBack();
    }
}

export default DuosideCard;