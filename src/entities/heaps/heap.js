import { heapText, heapField } from "../../factory/heap.factory.js";
import { isPointInsideRect } from "../../utils/utils.js";

import Konva from "konva";
import {buttonElement} from "../../factory/buttons.factory";

import ws from "../../core/websocket";

function Heap(board, options = {}, id) {
    this.elements = new Map();
    this.id = id;

    const game = board.get_layer('board');

    const field = heapField(options);
    const buttonEntire = buttonElement(options, '/union.svg');
    const buttonShuffle = buttonElement({ ...options, y: (options.y || 0) + 44 }, '/shuffle.svg');

    let isShuffling = false;

    game.add(field);
    game.add(buttonEntire);
    game.add(buttonShuffle);


    /* Добавить элемент */
    this.add_element = (element, id) => {
        this.elements.set(id, element);
        game.add(element.element);
    }

    this.get_element = (id) => {
        return this.elements.get(id);
    }

    /* Объединить карты */
    this.entire = (e, fromWS) => {
        if ( !fromWS ) ws.receiver.send('entire', { heap_id: this.id });

        this.elements.forEach(el => {
            const newX = options.x + (options.width / 2);
            const newY = options.y + (options.height / 2)

            el.element.x(newX);
            el.element.y(newY);

            el.element.prevPosition({ x: newX, y: newY });
            if ( !el.element.flipped() ) {
                el.flipToTop();
            }
        })
    }

    /* Перемешать карты */
    this.shuffle = (e, fromWS) => {
        if ( isShuffling ) return false;
        isShuffling = true;

        if ( !fromWS ) ws.receiver.send('shuffle', { heap_id: this.id });

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
            this.random();
            const sync_config = [];

            for ( const [key, val] of this.elements ) {
                val.element.moveToTop();
                sync_config.push({ id: key, zindex: val.element.zIndex() });
            }

            ws.receiver.send('shuffle_end', { heap_id: this.id, sync_config });
            isShuffling = false;
        },  500)
    }


    this.random = () => {
        this.elements = new Map([...this.elements.entries()].sort(() => Math.random() - 0.5));
    }

    this.randomRotate = () => {
        function randomInteger(min, max) {
            let rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        }

        const rotateDegs = [90, 180, 270, 360];
        for ( const [key, val] of this.elements.entries() ) {
            val.element.rotation(rotateDegs[randomInteger(0,3)]);
        }
    }


    buttonEntire.on('click', this.entire);
    buttonShuffle.on('click', this.shuffle);
}

export default Heap;