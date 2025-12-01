import {senderManager, layersManager} from "../../../core";

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
    flip(ws) {
        layersManager.clearCacheAllGroups();

        const animation = this.uiManager.getFlipAnimation(this.element, () => {
            this.element.flipped() ? this.flipBack() : this.flipFront();
            layersManager.cacheAllGroups(200);
        })

        animation.play();

        if ( ws && ws.server ) return false;
        senderManager.send("api.cards.action", { method: 'flip', id: this.element.id() });
    }

    rotateRight(ws) {
        layersManager.clearCacheAllGroups();

        const rotationDeg = this.element.rotation() === 360 ? 90 : this.element.rotation() + 90;
        this.uiManager.setRotateDeg(this.element, rotationDeg);

        layersManager.cacheAllGroups();

        if ( ws && ws.server ) return false;
        senderManager.send("api.cards.action", { method: 'rotateRight', id: this.element.id() });
    }

    rotateLeft(ws) {
        layersManager.clearCacheAllGroups();

        const rotationDeg = this.element.rotation() === 0 ? -90 : this.element.rotation() - 90;
        this.uiManager.setRotateDeg(this.element, rotationDeg);

        layersManager.cacheAllGroups();

        if ( ws && ws.server ) return false;
        senderManager.send("api.cards.action", { method: 'rotateLeft', id: this.element.id() });
    }

    toBottom(ws) {
        layersManager.clearCacheAllGroups();
        this.element.moveToBottom();

        layersManager.cacheAllGroups();

        if ( ws && ws.server ) return false;
        senderManager.send("api.cards.action", { method: 'toBottom', id: this.element.id() });
    }

    toTop(ws) {
        layersManager.clearCacheAllGroups();
        this.element.moveToTop();
        layersManager.cacheAllGroups();

        if ( ws && ws.server ) return false;
        senderManager.send("api.cards.action", { method: 'toTop', id: this.element.id() });
    }
}

export default CardManager;