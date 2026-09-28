import {layersManager} from "../../../core";

class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.uiManager.createSideImages(this.element, src);
    }

    flipBack() {
        this.uiManager.setBackImage(this.element);
        this.element.flipped(false);
    }

    flipFront() {
        this.uiManager.setFrontImage(this.element);
        this.element.flipped(true);
    }

    /* Поворот карточки */
    flip() {
        layersManager.clearCacheAllGroups();

        const animation = this.uiManager.getFlipAnimation(this.element, () => {
            this.element.flipped() ? this.flipBack() : this.flipFront();
            layersManager.cacheAllGroups(200);
        })

        animation.play();
    }

    rotateRight() {
        layersManager.clearCacheAllGroups();

        const rotationDeg = this.element.rotation() === 360 ? 90 : this.element.rotation() + 90;
        this.uiManager.setRotateDeg(this.element, rotationDeg);

        layersManager.cacheAllGroups();
    }

    rotateLeft() {
        layersManager.clearCacheAllGroups();

        const rotationDeg = this.element.rotation() === 0 ? -90 : this.element.rotation() - 90;
        this.uiManager.setRotateDeg(this.element, rotationDeg);

        layersManager.cacheAllGroups();
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

export default CardManager;