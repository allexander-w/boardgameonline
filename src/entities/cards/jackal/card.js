import DuosideElement from "../duoside";

function JackalCard(src, options = {}, flipped, isSprite = true, id) {
    DuosideElement.apply(this, arguments);

    this.selected = false;

    /* Событие выделить карточку */
    this.select = () => {
        this.element.stroke("rgba(255, 255, 255, 0.9)");
        this.selected = true;
    }

    this.removeSelection = () => {
        this.element.stroke("transparent");
        this.selected = false;
    }

    /* Событие двойного клика для переворота элемента */
    // this.element.on("click", this.toggleSelect);
}

export default JackalCard;