import Heaps from "../../core/heaps";
import Heap from "./heap";
import JackalCard from "../cards/jackal/card";
import ws from "../../core/websocket";
import Konva from "konva";

function JackalHeaps(game, board, field) {
    Heaps.apply(this, arguments);

    const stage = board.stage;

    const heap = new Heap(game, { x: -1000, y: -1000, width: 1, height: 1 }, "card");
    for ( const [index, value] of new Array(117).entries() ) {
        const card = new JackalCard('/jackal/card/' + (index + 1) + '.png', { x: 0, y: 0, elementId: "card", numId: "card" + '_' + index, width: 248, height: 248, draggable: false }, true, true, "card" + '_' + index);
        heap.elements.set("card" + '_' + index, card);
        field.add(card.element);

        // heap.add_element(card, "card" + '_' + index);
    }

    const shipsHeap = this.heaps.get('boat');

    for ( let i = 0; i < 2; i++) {
        const ship = shipsHeap.get_element('boat_' + i);
        ship.element.x(248*5);
        ship.element.y(i * 11 * 248 + (i === 0 ? -248 : 0));
    }


    heap.random();
    heap.randomRotate();
    this.heaps.set("card", heap);


    let index = 0;
    let size = 11;


    for (const [key, card] of heap.elements) {
        card.element.moveToBottom();

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



    this.selected = new Map();

    const clearSelections = () => {
        for ( const [key, value] of this.selected.entries() ) {
            value.removeSelection();
        }
    }

    const selectElements = (e, fromWS) => {
        if ( !fromWS ) ws.receiver.send("select", { elementId: e.target.attrs.elementId, numId: e.target.attrs.numId });

        if ( e.target.attrs.elementId !== 'card' ) {
            clearSelections();
            return false;
        }

        const el = heap.get_element(e.target.attrs.numId);

        if ( el.selected ) {
            el.removeSelection();
            this.selected.delete(e.target.attrs.numId);

        } else {
            if ( this.selected.size >= 2 ) {
                clearSelections();
                this.selected.clear();
            }

            el.select();
            this.selected.set(e.target.attrs.numId, el);
        }
    }

    stage.on("click", selectElements);


    ws.emitter.on("select", (data) => {
        const event = { target: { attrs: { elementId: data.elementId, numId: data.numId } } };
        selectElements(event, true);
    })




    const translateCards = (fromWS) => {
        if ( !fromWS ) ws.receiver.send('translate');

        if ( this.selected.size < 2 ) return false;
        const iterator = this.selected.entries();

        const first = iterator.next().value;
        const second = iterator.next().value;

        const saved = { x: first[1].element.x(), y: first[1].element.y() };
        first[1].element.moveToTop();
        second[1].element.moveToTop();

        const firstAnim = new Konva.Tween({
            node: first[1].element,
            duration: 0.3,
            scaleX: 1.3,
            scaleY: 1.3,
            x: second[1].element.x(),
            y: second[1].element.y(),

            onFinish: () => {

                new Konva.Tween({
                    node: first[1].element,
                    duration: 0.3,
                    scaleY: 1,
                    scaleX: 1, // Разворачиваем обратно

                    onFinish: () => {
                        first[1].element.moveToBottom();
                    }
                }).play();
            },
        });

        const secAnim = new Konva.Tween({
            node: second[1].element,
            duration: 0.3,
            scaleX: 1.3,
            scaleY: 1.3,
            x: saved.x,
            y: saved.y,

            onFinish: () => {

                new Konva.Tween({
                    node: second[1].element,
                    duration: 0.3,
                    scaleY: 1,
                    scaleX: 1,
                    onFinish: () => {
                        second[1].element.moveToBottom();
                    }
                }).play();
            },
        });

        firstAnim.play();
        secAnim.play();
    }
    ws.emitter.on("keydown", (e) => {
        if ( e.code === 'KeyV' ) {
            translateCards();
        }
    })

    ws.emitter.on("translate", (data) => {
        translateCards(true);
    })





    let group = []; // Группа для объединения элементов

    function findElementsAbove(target) {
        const targetBox = target.getClientRect();
            return stage.find('Rect').filter((other) => {
            if (other === target) return false; // Пропускаем сам элемент
            if (other.attrs.elementId === 'card') return false;
            if (other.zIndex() < target.zIndex()) return false;

            const otherBox = other.getClientRect();

            return !(
                targetBox.x + targetBox.width < otherBox.x ||
                targetBox.x > otherBox.x + otherBox.width ||
                targetBox.y + targetBox.height < otherBox.y ||
                targetBox.y > otherBox.y + otherBox.height
            );
        });
    }
    function groupElements(target) {
        const elementsAbove = findElementsAbove(target);
        if (elementsAbove.length === 0) {
            ws.receiver.send('movetop', { id: target._id });
            target.moveToTop();
            return;
        }

        group = elementsAbove.map(el => ({ offset: { x: target.x() - el.x(), y: target.y() - el.y() }, element: el }));
    }

    function ungroupElements(target) {
        if (!group.length) return;
        group = [];
    }

    function dragElements(target) {
        if (!group.length) return;
        ws.receiver.send('groupmove', { elements: group.map(el => ({ id: el.element._id, offset: el.offset })), target: { x: target.x(), y: target.y() } });

        group.forEach(el => {
            el.element.x(target.x() - el.offset.x);
            el.element.y(target.y() - el.offset.y);
        })
    }


    ws.emitter.on("groupmove", (data) => {
        const el = game.children.find(el => el._id === data.id);
        if ( el ) el.moveToTop();
    })

    ws.emitter.on("groupmove", (data) => {
        data.elements.forEach(element => {
            const el = game.children.find(el => el._id === element.id);

            el.x(data.target.x - element.offset.x);
            el.y(data.target.y - element.offset.y);
        })
    })

    ws.emitter.on("DRAGMOVE", (e) => {
        if ( e.target.attrs.elementId ) {
            dragElements(e.target);
        }
    });

    ws.emitter.on("DRAGSTART", (e) => {
        if ( e.target.attrs.elementId ) {
            groupElements(e.target);
        }
    });

    ws.emitter.on("DRAGEND", (e) => {
        if ( e.target.attrs.elementId ) {
            ungroupElements(e.target);
        }
    });

}

export default JackalHeaps;