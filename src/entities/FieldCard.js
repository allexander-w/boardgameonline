import {duosideElement, loadImageDuosideElement} from "../factory/cards.factory";

class FieldCard {
    constructor(src, options) {

        /* Загрузка картинки элемента */
        this.element = duosideElement(options);

        loadImageDuosideElement(this.element, src.front).then(image => {
            this.front = image;
        })
    }

    get banTaking() {
        return true;
    }

    get forSave() {
        return {
            x: this.element.x(),
            y: this.element.y(),
            id: this.element.id(),
            zIndex: this.element.zIndex()
        }
    }

    forLoad(options) {
        this.element.x(options.x);
        this.element.y(options.y);
        this.element.id(options.id);
        this.element.zIndex(options.zIndex);
    }
}

export default FieldCard;