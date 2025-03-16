import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";

import {getFlipAnimation} from "../../factory/animations.factory";
import { duosideElement, loadImageDuosideElement } from "../../factory/cards.factory";

function DuosideElement(src, options = {}) {
    const { flipped, bgURI, isAbsoluteBgUri, rotation, ...opts } = options;

    this.id = opts.id;
    this.front = null;

    this.bg = new Image();




    /* Загрузка картинки элемента */
    this.element = duosideElement(opts);

    loadImageDuosideElement(this.element, src).then(image => {
        this.element.moveToTop();
        this.front = image;
        if ( !bgURI ) this.bg = image;

        flipped ? this.flipOnBottom() : this.flipToTop();

        if ( bgURI ) {

            loadImageDuosideElement(this.element, isAbsoluteBgUri ? bgURI : bgURI + "bg.png").then(image => {
                this.bg = image;
            })
        }
    })




    /* Методы */
    this.flipToTop = () => {
        this.element.fillPatternImage(this.bg);
        this.element.flipped(true);
    }

    this.flipOnBottom = () => {
        this.element.fillPatternImage(this.front);
        this.element.flipped(false);
    }

    this.markHidden = () => {
        this.element.opacity(0.5);
    }

    this.removeHidden = () => {
        this.element.opacity(1);
    }

    /* Перевернуть элемент */
    this.flip = () => {
        this.element.flipped() ? this.flipOnBottom() : this.flipToTop();
    }

    this.fix = () => {
        this.element.draggable() ? this.element.draggable(false) : this.element.draggable(true);
    }

    this.toBottom = () => {
        this.element.moveToBottom();
    }

    this.rotate = (e, fromWS) => {
        if ( !fromWS ) ws.receiver.send("rotate", { id: this.id, heap: opts.parentID });

        if ( this.element.rotation() === 360 ) {
            this.element.rotation(0);
            return false;
        }
        this.element.rotation(this.element.rotation() + 20);
    }

    /* Функция анимации переворота элемента */
    this.flipElement = (fromClick) => {
        if ( fromClick ) ws.receiver.send(actions.flip, { id: this.id, heap: opts.parentID });
        const tween = getFlipAnimation(this.element, this.flip);
        tween.play();
    }

    this.destroyElement = () => {
        this.element.off();
        this.element.remove();
        this.element.destroy();
    }

    /* Событие двойного клика для переворота элемента */
    if ( rotation ) {
        this.element.on("click", this.rotate);
    } else {
        this.element.on("dblclick", this.flipElement);
    }
}

export default DuosideElement;