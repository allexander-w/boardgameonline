import {moduleManager, senderManager, cardsManager} from "../../../core";

class HandManager {
    constructor(layersManager, cardsManager, moduleManager, UIManager) {
        this.layersManager = layersManager;
        this.cardsManager = cardsManager;
        this.moduleManager = moduleManager;
        this.UIManager = UIManager;

        this.hands = [];
        this.boardLayer = this.layersManager.getLayer("board");
    }


    _findElementsAbove(target) {
        const targetBox = target.getClientRect();
        return this.boardLayer.find('Rect').filter((other) => {
            const otherBox = other.getClientRect();

            return !(
                targetBox.x + targetBox.width < otherBox.x + (otherBox.width / 2) ||
                targetBox.x + (otherBox.width / 2) > otherBox.x + otherBox.width ||
                targetBox.y + targetBox.height < otherBox.y + (otherBox.height / 2) ||
                targetBox.y + (otherBox.height / 2) > otherBox.y + otherBox.height
            );
        });
    }

    shuffle() {
        this.hands = new Map([...this.hands.entries()].sort(() => Math.random() - 0.5));
        console.log("shuffle");

        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Карты перемешаны", { color: "green" });
    }

    take(el) {
        this.layersManager.clearCacheAllGroups();

        this.hands.push(el);
        el.hide();

        this.layersManager.cacheAllGroups();
        senderManager.send("modules.hand.take", { id: el.id() });

        this.UIManager.renderCards(this.hands);
    }

    remoteTake(data) {
        this.layersManager.clearCacheAllGroups();

        const card = cardsManager.getCard(data.id);
        if ( card ) card.element.hide();

        this.layersManager.cacheAllGroups();
    }

    takeAll(el) {
        const elementsAbove = this._findElementsAbove(el);

        if ( elementsAbove.length ) {
            this.hands = [...this.hands, ...elementsAbove];
            this.layersManager.clearCacheAllGroups();

            elementsAbove.forEach(el => el.hide());

            this.layersManager.cacheAllGroups();

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);

            senderManager.send("modules.hand.takeAll", { cards: elementsAbove.map((el) => (el.id())) });
        }
    }

    remoteTakeAll(data) {
        this.layersManager.clearCacheAllGroups();

        for ( const id of data.cards ) {
            const card = cardsManager.getCard(id);
            if ( card ) card.element.hide();
        }

        this.layersManager.cacheAllGroups();
    }

    takeHalf(el) {
        const elementsAbove = this._findElementsAbove(el);

        if ( elementsAbove.length ) {
            const half = elementsAbove.slice(Math.ceil(elementsAbove.length / 2));
            this.hands = [...this.hands, ...half];

            this.layersManager.clearCacheAllGroups();
            half.forEach(el => el.hide());
            this.layersManager.cacheAllGroups();

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);

            senderManager.send("modules.hand.takeHalf", { cards: half.map((el) => (el.id())) });
        }
    }

    remoteTakeHalf(data) {
        this.layersManager.clearCacheAllGroups();

        for ( const id of data.cards ) {
            const card = cardsManager.getCard(id);
            if ( card ) card.element.hide();
        }

        this.layersManager.cacheAllGroups();
    }

    put() {
        const pos = this.boardLayer.getRelativePointerPosition();
        const config = [];

        this.layersManager.clearCacheAllGroups();

        this.hands.forEach((el, index) => {
            el.x(pos.x);
            el.y(pos.y);

            const card = this.cardsManager.getCard(el.id());
            if ( card && card.cardManager && card.cardManager.flipBack ) card.cardManager.flipBack();

            el.moveToTop();
            el.show();

            config.push({ id: el.id(), zIndex: el.zIndex(), pos });
        })

        this.layersManager.cacheAllGroups();

        this.hands = [];

        const actionsManager = moduleManager.getModule("actions");
        actionsManager.selectCouple(0);

        senderManager.send("modules.hand.put", { cards: config});
    }

    remotePut(data) {
        this.layersManager.clearCacheAllGroups();

        let index = 0;
        for ( const el of data.cards ) {
            const card = this.cardsManager.getCard(el.id);
            if ( !card ) continue;
            if ( card && card.cardManager && card.cardManager.flipBack ) card.cardManager.flipBack();

            card.element.x(el.pos.x);
            card.element.y(el.pos.y);

            card.element.zIndex(el.zIndex);
            card.element.show();

            index ++;
        }

        this.layersManager.cacheAllGroups();
    }
}

export default HandManager;