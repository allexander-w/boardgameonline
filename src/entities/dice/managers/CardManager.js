import {randomInteger} from "../../../utils/utils";
import {senderManager} from "../../../core";

class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.sides = options.sides || 6;
        this.uiManager.createSideImages(this.element, src, options.sides);

        this.interval = null;

        this.index = 0;
    }

    _rollIntervalFunc() {
        this.index = randomInteger(0, this.sides - 1);
        this.element.fillPatternOffset({ x: (this.element.width() * this.index) / this.element.fillPatternScale().x, y: 0 });
    }

    roll() {
        if ( this.interval ) return false;
        this.interval = setInterval(this._rollIntervalFunc.bind(this), 10);

        const animation = this.uiManager.getRollAnimation(this.element, () => {
            clearInterval(this.interval);
            this.interval = null;

            this.element.fillPatternOffset({ x: (this.element.width() * this.index) / this.element.fillPatternScale().x, y: 0 });
            senderManager.send("api.cards.action", { method: 'remoteRollEnd', id: this.element.id(), payload: { index: this.index } });
        });

        animation.play();

        senderManager.send("api.cards.action", { method: 'remoteRollStart', id: this.element.id() });
    }

    remoteRollStart() {
        if ( this.interval ) return false;
        const animation = this.uiManager.getRollAnimation(this.element, () => {});
        animation.play();
    }

    remoteRollEnd(ws, data) {
        this.element.fillPatternOffset({ x: (this.element.width() * parseInt(data.index)) / this.element.fillPatternScale().x, y: 0 });
    }

}

export default CardManager;