import CounterUIManager from "./managers/CounterUIManager";
import CounterHandler from "./handlers/CounterHandler";
import CounterManager from "./managers/CounterManager";
import InterfaceCard from "../InterfaceCard";
import { zoneManager } from "../../core";

class CounterCard extends InterfaceCard {
    constructor(src, options = {}) {
        super();

        this.src = src;
        this.ban = !!options.ban;
        this.uiManager = new CounterUIManager();
        this.counterManager = new CounterManager(src, options, this.uiManager);
        this.counterHandler = new CounterHandler(this.counterManager);
    }

    get banTaking() {
        return this.ban;
    }

    get element() {
        return this.counterManager.element;
    }

    dragstart() {
        this.uiManager.dragstart(this.element);
    }

    dragend() {
        this.uiManager.dragend(this.element);
    }

    get options() {
        return [
            { method: "reset", name: "Сбросить к 0", icon: "arrow-counter-clockwise" },
            { method: "toBottom", name: "На задний план", icon: "arrow-fat-line-down" },
            { method: "toTop", name: "На передний план", icon: "arrow-fat-line-up" },
        ];
    }

    reset() {
        this.counterManager.reset();
    }

    toBottom() {
        this.counterManager.toBottom();
    }

    toTop() {
        this.counterManager.toTop();
    }

    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            zIndex: this.element.zIndex(),
            rotation: this.element.rotation(),
            id: this.element.id(),
            count: this.counterManager.getValue(),
            dock: zoneManager.getDock(this.element.id()),
        };
    }

    forLoad(options) {
        this.element.x(options.x);
        this.element.y(options.y);
        this.element.id(options.id);
        this.element.zIndex(options.zIndex);
        this.element.rotation(options.rotation);

        if (options.count !== undefined) {
            this.counterManager.setValue(options.count);
        }

        if (options.dock) {
            zoneManager.restore(this.element.id(), options.dock);
        }
    }
}

export default CounterCard;