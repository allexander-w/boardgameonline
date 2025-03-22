import {duosideElement, loadImageDuosideElement} from "../factory/cards.factory";

class FieldCard {
    constructor(src, options) {

        /* Загрузка картинки элемента */
        this.element = duosideElement(options);

        loadImageDuosideElement(this.element, src.front).then(image => {
            this.front = image;
        })

    }
}

export default FieldCard;