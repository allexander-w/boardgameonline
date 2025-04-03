import UIManager from "./managers/UIManager";
import CardHandler from "./handlers/CardHandler";
import CardManager from "./managers/CardManager";
import InterfaceCard from "../InterfaceCard";

class DiceCard extends InterfaceCard {
    constructor(src, options) {
        super();

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
            { method: "roll", name: "Бросить" }
        ]
    }
}

export default DiceCard;