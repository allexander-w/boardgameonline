import Konva from "konva";
import { duosideElement, loadImageDuosideElement } from "../../factory/cards.factory";
import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";


function DuosideElement(src, options = {}, flipped, isSprite = true, id) {

    /* Опции элемента */
    this.opts = {
        inHeap: true,
        id: id
    }


    /* Загрузка картинки элемента */
    this.element = duosideElement(options);

    loadImageDuosideElement(this.element, src, isSprite).then(element => {
        this.element.moveToTop();

        if ( flipped ) {
            this.flip();
        }
    })


    this.markHidden = () => {
        this.element.opacity(0.5);
    }

    this.removeHidden = () => {
        this.element.opacity(1);
    }


    this.flipToTop = () => {
        this.element.fillPatternOffset({ x: this.element.width() / this.element.fillPatternScale().x, y: 0 });
        this.element.flipped(true);
    }

    this.flipOnBottom = () => {
        this.element.fillPatternOffset({ x: 0, y: 0 });
        this.element.flipped(false);
    }

    /* Методы */
    /* Перевернуть элемент */
    this.flip = () => {
        if ( this.element.fillPatternOffset().x > -1 &&  this.element.fillPatternOffset().x < 1) {
            this.flipToTop();
        } else {
            this.flipOnBottom();
        }
    }

    /* Функция анимации переворота элемента */
    this.flipElement = (fromClick) => {
        if ( ws.ready() && fromClick ) {
            ws.receiver.send(actions.flip, { id: this.opts.id });
        }

        const tween = new Konva.Tween({
            node: this.element,
            duration: 0.2,
            scaleX: 0,
            scaleY: 1.2,
            // Сжимаем по X (половина переворота)
            onFinish: () => {
                this.flip();

                new Konva.Tween({
                    node: this.element,
                    duration: 0.2,
                    scaleY: 1,
                    scaleX: 1, // Разворачиваем обратно
                }).play();
            },
        });

        tween.play();
    }

    /* Событие двойного клика для переворота элемента */
    this.element.on("dblclick", this.flipElement);

}

export default DuosideElement;