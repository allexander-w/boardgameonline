import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";

import {getFlipAnimation} from "../../factory/animations.factory";
import { duosideElement, loadImageDuosideElement } from "../../factory/cards.factory";

function FieldElement(src, options = {}) {
    const { ...opts } = options;

    this.id = opts.id;
    this.front = null;

    /* Загрузка картинки элемента */
    this.element = duosideElement({...opts, link: this});

    loadImageDuosideElement(this.element, src).then(image => {
        this.front = image;
    })
}

export default FieldElement;