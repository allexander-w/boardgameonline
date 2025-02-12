import Heaps from "../../core/heaps";
import Heap from "./heap";
import DuosideElement from "../cards/duoside";

function JackalHeaps(game, stage) {
    Heaps.apply(this, arguments);

    const heap = new Heap(game, { x: -1000, y: -1000, width: 1, height: 1 }, "card");
    for ( const [index, value] of new Array(117).entries() ) {
        const card = new DuosideElement('/jackal/card/' + (index + 1) + '.png', { x: 0, y: 0, elementId: "card", numId: "card" + '_' + index, width: 248, height: 248, draggable: false }, true, true, "card" + '_' + index);
        heap.add_element(card, "card" + '_' + index);
    }

    heap.random();
    heap.randomRotate();
    this.heaps.set("card", heap);


    let index = 0;
    let size = 11;


    for (const [key, card] of heap.elements) {
        let row = Math.floor(index / size);
        let col = index % size;

        if ((row === 0 || row === size - 1) && (col === 0 || col === size - 1)) {
            index++;
            continue;
        }

        card.element.x(248 * col);
        card.element.y(248 * row);

        index++;
    }


    index = 0;
    for (const [key, card] of heap.elements) {
        if ( index === 0 ) {
            card.element.x(248 * 8);
            card.element.y(248 * 10);
        }


        if ( index === 110 ) {
            card.element.x(248 * 7);
            card.element.y(248 * 10);
        }

        if ( index === 10 ) {
            card.element.x(248 * 9);
            card.element.y(248 * 10);
        }

        index++;
    }
}

export default JackalHeaps;