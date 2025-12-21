import {moduleManager, senderManager, cardsManager} from "../../../core";
import KitManager from "./KitManager";

class HandManager {
    constructor(layersManager, cardsManager, moduleManager, UIManager) {
        this.layersManager = layersManager;
        this.cardsManager = cardsManager;
        this.moduleManager = moduleManager;
        this.UIManager = UIManager;

        this.hands = [];
        this.kitManager = new KitManager(this._isHandsHas.bind(this));
        this.boardLayer = this.layersManager.getLayer("board");
    }

    _isHandsHas(id) {
        return !!this.hands.find(el => el.id() === id);
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

    _getRenderCards() {
        const activeStack = this.kitManager.getActiveKitStack();
        return this.hands.filter(el => activeStack.has(el.id()));
    }

    shuffle() {
        this.hands = [...this.hands].sort(() => Math.random() - 0.5);
        console.log("shuffle", this.hands);

        const notificationsManager = moduleManager.getModule("notifications");
        notificationsManager.notify("Карты перемешаны", { color: "green" });
    }

    selectStack(id) {
        this.kitManager.changeActive(id);
        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
    }

    addStack() {
        this.kitManager.add();
        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
    }

    take(el) {
        this.layersManager.clearCacheAllGroups();
        const card = cardsManager.getCard(el.id());
        if ( card.banTaking ) return false;

        this.hands.push(el);
        el.hide();
        const cardId = el.id();

        card.cardManager.flipFront();

        this.layersManager.cacheAllGroups();
        senderManager.send("modules.hand.take", { id: cardId });

        this.kitManager.addToStack(cardId);
        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
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
            this.kitManager.add();

            elementsAbove.forEach(el => {
                el.hide();
                this.kitManager.addToStack(el.id());
            });

            this.layersManager.cacheAllGroups();

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);

            senderManager.send("modules.hand.takeAll", { cards: elementsAbove.map((el) => (el.id())) });
        }

        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
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
            half.forEach(el => {
                el.hide();
                this.kitManager.addToStack(el.id());
            });

            this.layersManager.cacheAllGroups();

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);

            senderManager.send("modules.hand.takeHalf", { cards: half.map((el) => (el.id())) });
        }

        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
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
        function partition(array, predicate) {
            const pass = [];
            const fail = [];

            array.forEach(item =>
                predicate(item) ? pass.push(item) : fail.push(item)
            );

            return [pass, fail];
        }

        const pos = this.boardLayer.getRelativePointerPosition();
        const config = [];

        this.layersManager.clearCacheAllGroups();


        const activeStack = this.kitManager.getActiveKitStack();
        const [passed, failed] = partition(this.hands, el => activeStack.has(el.id()));

        passed.forEach((el, index) => {
            el.x(pos.x);
            el.y(pos.y);

            const card = this.cardsManager.getCard(el.id());
            if ( card && card.cardManager && card.cardManager.flipBack ) card.cardManager.flipBack();

            el.moveToTop();
            el.show();

            this.kitManager.removeFromStack(el.id());
            config.push({ id: el.id(), zIndex: el.zIndex(), pos });
        })

        this.layersManager.cacheAllGroups();

        this.hands = failed || [];

        const actionsManager = moduleManager.getModule("actions");
        actionsManager.selectCouple(0);

        senderManager.send("modules.hand.put", { cards: config});


        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
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


    putById(id, event) {
        const stage = this.layersManager.stage;
        stage.setPointersPositions(event);
        const pos = this.boardLayer.getRelativePointerPosition();

        const selectedCard = this.hands.find(el => el.id() === id);
        if ( !selectedCard ) {
            this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);
            return false;
        }

        this.layersManager.clearCacheAllGroups();

        selectedCard.x(pos.x);
        selectedCard.y(pos.y);

        const card = this.cardsManager.getCard(selectedCard.id());
        if ( card && card.cardManager && card.cardManager.flipBack ) card.cardManager.flipFront();

        selectedCard.moveToTop();
        selectedCard.show();

        this.kitManager.removeFromStack(id);
        this.hands = this.hands.filter(el => el.id() !== id);
        const config = { id: selectedCard.id(), zIndex: selectedCard.zIndex(), pos };

        this.layersManager.cacheAllGroups();
        this.UIManager.renderCards(this._getRenderCards(), this.kitManager.handKit);

        senderManager.send("modules.hand.putById", { card: config});
    }

    remotePutById(data) {
        this.layersManager.clearCacheAllGroups();

        const selectedCard = this.cardsManager.getCard(data.card.id);
        console.log(data, selectedCard);
        if ( !selectedCard ) {
            this.layersManager.cacheAllGroups();
            return;
        }

        selectedCard.element.x(data.card.pos.x);
        selectedCard.element.y(data.card.pos.y);

        if ( selectedCard && selectedCard.cardManager && selectedCard.cardManager.flipBack ) selectedCard.cardManager.flipFront();

        selectedCard.element.zIndex(data.card.zIndex);
        selectedCard.element.show();

        this.layersManager.cacheAllGroups();
    }
}

export default HandManager;