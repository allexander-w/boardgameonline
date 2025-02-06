import DuosideElement from "../entities/cards/duoside";
import Heap from "../entities/heaps/heap";

function Heaps(game, stage) {
    this.heaps = new Map();


    const fireHeap = new Heap(game, { x: 1700, y: 0 });
    for ( const i of new Array(10)) {
        const card = new DuosideElement('/entities/fire/fire_sprite.png', { elementId: 'fire', x: 1800, y: 130 });
        fireHeap.add_element(card);
    }

    this.heaps.set("fire", fireHeap);

    const door = new DuosideElement('/entities/doors/door.png', { width: 75, height: 75, x: 300, y: 300 }, true);
    game.add(door.element);

    const burn = new DuosideElement('/entities/burnout/burn.png', { width: 57, height: 57, x: 100, y: 100 }, true, false);
    game.add(burn.element);

    const run = new DuosideElement('/entities/run/run.png', { width: 57, height: 57, x: 200, y: 200 }, true, false);
    game.add(run.element);

    const warn = new DuosideElement('/entities/warn/warn.png', { width: 75, height: 75, x: 400, y: 400 }, true, false);
    game.add(warn.element);

    const person = new DuosideElement('/entities/persons/1.png', { width: 95, height: 95, x: 500, y: 500 }, false);
    game.add(person.element);

    const person2 = new DuosideElement('/entities/persons/2.png', { width: 95, height: 95, x: 500, y: 500 }, false);
    game.add(person2.element);

    const machine = new DuosideElement('/entities/machines/01.png', { width: 253, height: 151, x: 600, y: 600 }, false, false);
    game.add(machine.element);

    const medicine = new DuosideElement('/entities/medicine/medicine.png', { width: 95, height: 95, x: 700, y: 700 }, false, false);
    game.add(medicine.element);

    const hero1 = new DuosideElement('/entities/hero/1.png', { width: 303, height: 452, x: 1000, y: 1000, cornerRadius: 20 }, false);
    game.add(hero1.element);

    const color = new DuosideElement('/entities/color/1.png', { width: 302, height: 221, x: 1300, y: 1300, cornerRadius: 15 }, false, false);
    game.add(color.element);

    const hero_chip = new DuosideElement('/entities/hero_chip/1.png', { width: 70, height: 70, x: 1400, y: 1400 }, false, false);
    game.add(hero_chip.element);


    stage.on('dragstart', (e) => {
        console.log('test');
        if ( e.target.attrs.elementId ) e.target.moveToTop();
    })

    stage.on('dragend', (e) => {
        if ( e.target.attrs.elementId ) {
            const heap = this.heaps.get(e.target.attrs.elementId);
            heap.check_chip_position(e);
        }
    })
}

export default Heaps;