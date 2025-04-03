import {randomInteger} from "../../../utils/utils";

class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.uiManager.createSideImages(this.element, src);

        this.index = 0;
    }

    _rollIntervalFunc() {
        this.index = randomInteger(0,5);
        this.element.fillPatternOffset({ x: (this.element.width() * this.index) / this.element.fillPatternScale().x, y: 0 });
    }

    roll() {
        let interval = setInterval(this._rollIntervalFunc.bind(this), 10);

        const animation = this.uiManager.getRollAnimation(this.element, () => {
            clearInterval(interval);
            this.element.fillPatternOffset({ x: (this.element.width() * this.index) / this.element.fillPatternScale().x, y: 0 });
        });

        animation.play();
    }

}

export default CardManager;