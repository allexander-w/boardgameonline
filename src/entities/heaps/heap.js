import { heapText, heapField } from "../../factory/heap.factory.js";
import { isPointInsideRect } from "../../utils/utils.js";

import Konva from "konva";
import {buttonElement} from "../../factory/buttons.factory";

import ws from "../../core/websocket";

function Heap(game, options = {}, id) {
    this.elements = new Map();
    this.in_heap_count = 0;
    this.id = id;

    const field = heapField(options);
    const nameShape = heapText(this.in_heap_count, options);
    const buttonEntire = buttonElement(options, '/union.svg');
    const buttonShuffle = buttonElement({ ...options, y: (options.y || 0) + 44 }, '/shuffle.svg');

    let isShuffling = false;

    game.add(field);
    game.add(nameShape);
    game.add(buttonEntire);
    game.add(buttonShuffle);


    /* Добавить элемент */
    this.add_element = (element, id) => {
        this.elements.set(id, element);
        this.in_heap_count = this.elements.length;

        nameShape.text(this.in_heap_count);
        game.add(element.element);
    }

    this.get_element = (id) => {
        return this.elements.get(id);
    }

    /* Добавить в стопку */
    this.to_heap = () => {
        this.in_heap_count ++;
        nameShape.text(this.in_heap_count);
    }

    /* Убрать из стопки */
    this.from_heap = () => {
        this.in_heap_count --;
        nameShape.text(this.in_heap_count);
    }


    /* Проверить, находится ли карта в стопке */
    this.check_chip_position = (e) => {
        const point = { x: e.target?.attrs?.x, y: e.target?.attrs?.y };
        const prevPoint = e.target.prevPosition();
        const rectangle = { x: field.x(), y: field.y(), width: field.width(), height: field.height() };

        if ( isPointInsideRect(point, rectangle) && !isPointInsideRect( prevPoint, rectangle) ) {
            this.to_heap()
        }

        if ( isPointInsideRect( prevPoint, rectangle) && !isPointInsideRect(point, rectangle) ) {
            this.from_heap();
        }

        e.target.prevPosition(point);
    }


    /* Объединить карты */
    this.entire = () => {
        this.elements.forEach(el => {
            const newX = options.x + (options.width / 2);
            const newY = options.y + (options.height / 2)

            el.element.x(newX);
            el.element.y(newY);

            el.element.prevPosition({ x: newX, y: newY });
            if ( el.opts.flipped ) {
                el.flip();
            }
        })

        this.in_heap_count = this.elements.length;
        nameShape.text(this.in_heap_count);
    }



    /* Перемешать карты */
    this.shuffle = (e, fromWS) => {
        if ( isShuffling ) return false;
        isShuffling = true;

        ws.receiver.send('shuffle', { heap_id: this.id });

        [...this.elements].slice(0, 5).forEach(([key, value], i) => {
            const tween = new Konva.Tween({
                node: value.element,
                duration: 0.1,
                x: value.element.x() + 20,

                onFinish: () => {
                    new Konva.Tween({
                        node: value.element,
                        duration: 0.1,
                        x: value.element.x() - 20,
                    }).play();
                },
            });

            setTimeout(() => {
                value.element.moveToTop();
                tween.play();

            }, i * 100);
        });

        if ( fromWS ) {
            isShuffling = false;
            return false;
        }

        setTimeout(() => {
            this.elements = new Map([...this.elements.entries()].sort(() => Math.random() - 0.5));
            const sync_config = [];

            for ( const [key, val] of this.elements ) {
                val.element.moveToTop();
                sync_config.push({ id: key, zindex: val.element.zIndex() });
            }

            ws.receiver.send('shuffle_end', { heap_id: this.id, sync_config });
            isShuffling = false;
        },  1000)
    }


    buttonEntire.on('click', this.entire);
    buttonShuffle.on('click', this.shuffle);
}

export default Heap;