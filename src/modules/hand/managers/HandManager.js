import {moduleManager} from "../../../core";

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

    shuffle (){
        this.hands = new Map([...this.hands.entries()].sort(() => Math.random() - 0.5));
    }

    take(el) {
        this.hands.push(el);
        el.hide();
    }

    takeAll(el) {
        const elementsAbove = this._findElementsAbove(el);

        if ( elementsAbove.length ) {
            this.hands = [...this.hands, ...elementsAbove];
            elementsAbove.forEach(el => el.hide());

            const actionsManager = moduleManager.getModule("actions");
            actionsManager.selectCouple(this.hands.length);
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
        }
    }

    put() {
        const pos = this.boardLayer.getRelativePointerPosition();
        const config = [];

        this.hands.forEach(el => {
            el.x(pos.x);
            el.y(pos.y);

            const card = this.cardsManager.getCard(el.id());
            if ( card ) card.cardManager.flipBack();

            el.moveToTop();
            el.show();

            config.push({ id: el.id(), zIndex: el.zIndex(), pos });
        })

        this.hands = [];

        const actionsManager = moduleManager.getModule("actions");
        actionsManager.selectCouple(0);
    }

}

export default HandManager;