import {moduleManager, senderManager} from "../../../core";

export class AutomaticsManager {
    constructor(layersManager, moduleManager) {
        this.layersManager = layersManager;
        this.moduleManager = moduleManager;

        this.boardLayer = this.layersManager.getLayer("board");

        this.stack = [];
    }

    _findElementsAbove(targetBox) {
        console.log(this.boardLayer);
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

    moveCard(id, coordinates) {

    }

    takeAllFromPoint(coordinates) {

        const targetBox = {
            "x": 788.6183555192696,
            "y": 263.9306361975012,
            "width": 108.0884819481181,
            "height": 163.25228346966236
        }

        const elementsAbove = this._findElementsAbove(targetBox);
        console.log(elementsAbove);

        if ( elementsAbove.length ) {
            this.stack = [ ...this.stack, ...elementsAbove ];

            // elementsAbove.forEach(el => el.hide());

            // const actionsManager = moduleManager.getModule("actions");
            // actionsManager.selectCouple(this.hands.length);
            //
            // senderManager.send("modules.hand.takeAll", { cards: elementsAbove.map((el) => (el.id())) });
        }

    }

    putToPoint(coordinates) {

    }

    shuffleCards() {

    }

    putMatrix(matrixArray, coordinates) {

    }
}