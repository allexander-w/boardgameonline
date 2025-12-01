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
            { method: "roll", name: "Бросить", icon: "dice-six" }
        ]
    }

    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            zIndex: this.element.zIndex(),
            id: this.element.id(),

            result: this.cardManager.index,
        }
    }

    forLoad(options) {
        this.element.x(options.x);
        this.element.y(options.y);
        this.element.id(options.id);
        this.element.zIndex(options.zIndex);
        this.element.rotation(options.rotation);

        this.cardManager.index = parseInt(options.result);
        this.element.fillPatternOffset({ x: (this.element.width() * parseInt(options.result)) / this.element.fillPatternScale().x, y: 0 });
    }

}

export default DiceCard;