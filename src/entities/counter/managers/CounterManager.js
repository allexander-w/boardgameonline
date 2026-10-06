import { layersManager, senderManager } from "../../../core";

class CounterManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;
        this.element = this.uiManager.createElement(options);

        if (src) {
            this.uiManager.loadImage(this.element, src);
        }
    }

    getValue() {
        return this.element.count();
    }

    setValue(value) {
        layersManager.clearCacheAllGroups();
        this.uiManager.updateText(this.element, value);
        layersManager.cacheAllGroups();
    }

    changeValue(value) {
        this.setValue(value);
        senderManager.send("api.cards.action", {
            method: "remoteSetValue",
            id: this.element.id(),
            payload: { value },
        });
    }

    remoteSetValue({ value }) {
        this.uiManager.updateText(this.element, value);
    }

    increment() {
        this.changeValue(this.getValue() + 1);
    }

    decrement() {
        this.changeValue(this.getValue() - 1);
    }

    reset() {
        this.changeValue(0);
    }

    toBottom() {
        layersManager.clearCacheAllGroups();
        this.element.moveToBottom();
        layersManager.cacheAllGroups();
    }

    toTop() {
        layersManager.clearCacheAllGroups();
        this.element.moveToTop();
        layersManager.cacheAllGroups();
    }
}

export default CounterManager;