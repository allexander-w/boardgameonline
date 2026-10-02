import UIManager from "./managers/UIManager";
import CardManager from "./managers/CardManager";
import CardHandler from "./handlers/CardHandler";
import InterfaceCard from "../InterfaceCard";
import { zoneManager } from "../../core";

class ResourceCard extends InterfaceCard {
    constructor(src, options) {
        super();


        this.src = src;
        this.uiManager = new UIManager();
        this.cardManager = new CardManager(src, options, this.uiManager);
        this.cardHandler = new CardHandler(this.cardManager);
    }

    get banTaking() {
        return true;
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
            { method: "putAway", name: "Убарть", icon: "coin" }
        ]
    }


    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            zIndex: this.element.zIndex(),
            rotation: this.element.rotation(),
            id: this.element.id(),
            kind: this.element.getAttr("kind"),
            resource: true,
            src: this.src.front,
            width: this.element.width(),
            height: this.element.height(),
            dock: zoneManager.getDock(this.element.id()),
        };
    }

    forLoad(options) {
        this.element.x(options.x);
        this.element.y(options.y);
        this.element.rotation(options.rotation || 0);
        if (options.zIndex !== undefined) this.element.zIndex(options.zIndex);
    }
}

export default ResourceCard;