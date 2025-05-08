import {moduleManager, senderManager, cardsManager} from "../../../core";

class HandManager {
    constructor(layersManager, cardsManager, moduleManager) {
        this.layersManager = layersManager;
        this.cardsManager = cardsManager;
        this.moduleManager = moduleManager;

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
        this.hands.push(el);
        el.hide();

        senderManager.send("modules.hand.take", { id: el.id() });
    }

    remoteTake(data) {
        const card = cardsManager.getCard(data.id);
        if ( card ) card.element.hide();
    }

    takeAll(el) {
        const elementsAbove = this._findElementsAbove(el);

        if ( elementsAbove.length ) {
            this.hands = [...this.hands, ...elementsAbove];
            elementsAbove.forEach(el => el.hide());

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);

            senderManager.send("modules.hand.takeAll", { cards: elementsAbove.map((el) => (el.id())) });
        }
    }

    remoteTakeAll(data) {
        for ( const id of data.cards ) {
            const card = cardsManager.getCard(id);
            if ( card ) card.element.hide();
        }
    }

    takeHalf(el) {
        const elementsAbove = this._findElementsAbove(el);

        if ( elementsAbove.length ) {
            const half = elementsAbove.slice(Math.ceil(elementsAbove.length / 2));
            this.hands = [...this.hands, ...half];

            half.forEach(el => el.hide());

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);

            senderManager.send("modules.hand.takeHalf", { cards: half.map((el) => (el.id())) });
        }
    }

    remoteTakeHalf(data) {
        for ( const id of data.cards ) {
            const card = cardsManager.getCard(id);
            if ( card ) card.element.hide();
        }
    }

    put() {
        const pos = this.boardLayer.getRelativePointerPosition();
        const config = [];

        this.hands.forEach((el, index) => {
            el.x(pos.x + (index + 4));
            el.y(pos.y + (index + 4));

            const card = this.cardsManager.getCard(el.id());
            if ( card && card.cardManager && card.cardManager.flipBack ) card.cardManager.flipBack();

            el.moveToTop();
            el.show();

            config.push({ id: el.id(), zIndex: el.zIndex(), pos });
        })

        this.hands = [];

        const actionsManager = moduleManager.getModule("actions");
        actionsManager.selectCouple(0);

        senderManager.send("modules.hand.put", { cards: config});
    }

    remotePut(data) {
        let index = 0;
        for ( const el of data.cards ) {
            const card = this.cardsManager.getCard(el.id);
            if ( !card ) continue;
            if ( card && card.cardManager && card.cardManager.flipBack ) card.cardManager.flipBack();

            card.element.x(el.pos.x + (index + 4));
            card.element.y(el.pos.y + (index + 4));

            card.element.zIndex(el.zIndex);
            card.element.show();

            index ++;
        }
    }

}

export default HandManager;