import UIManager from "./managers/UIManager";
import CardManager from "./managers/CardManager";
import CardHandler from "./handlers/CardHandler";
import InterfaceCard from "../InterfaceCard";

class ResourceCard extends InterfaceCard {
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
            { method: "putAway", name: "Убарть" }
        ]
    }

    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            id: this.element.id(),
            resource: true,
            src: this.src.front,
            width: this.element.width(),
            height: this.element.height()
        }
    }
}

export default ResourceCard;