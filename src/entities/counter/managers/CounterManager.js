import { layersManager } from "../../../core";

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

    increment() {
        this.setValue(this.getValue() + 1);
    }

    decrement() {
        this.setValue(this.getValue() - 1);
    }

    reset() {
        this.setValue(0);
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