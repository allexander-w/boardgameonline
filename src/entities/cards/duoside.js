import Konva from "konva";
import { duosideElement, loadImageDuosideElement } from "../../factory/cards.factory";
import CARD_DEFAULTS from "../../defaults/cards.defaults";

function DuosideElement(src, options = {}, flipped, isSprite = true) {

    /* Опции элемента */
    this.opts = {
        flipped: false,
        inHeap: true
    }


    /* Загрузка картинки элемента */
    this.element = duosideElement(options);

    loadImageDuosideElement(this.element, src, isSprite).then(element => {
        this.element.moveToTop();

        if ( flipped ) {
            this.opts.flipped = true;
            this.flip();
        }
    })


    /* Методы */
    /* Перевернуть элемент */
    this.flip = () => {
        if ( this.element.fillPatternOffset().x === 0 ) {
            this.element.fillPatternOffset({ x: this.element.width() / this.element.fillPatternScale().x, y: 0 });
            this.opts.flipped = true;
        } else {

            this.element.fillPatternOffset({ x: 0, y: 0 });
            this.opts.flipped = false;
        }
    }

    /* Функция анимации переворота элемента */
    const flipElement = () => {
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
    this.element.on("dblclick", flipElement);

}

export default DuosideElement;