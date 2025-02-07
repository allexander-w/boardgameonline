import DuosideElement from "../entities/cards/duoside";
import Heap from "../entities/heaps/heap";
import entitiesConfig from "../config/entities.config.js";

function Heaps(game, stage) {
    this.heaps = new Map();


    for ( const config of entitiesConfig ) {
        const heap = new Heap(game, config.heap_config);
        for ( const [index, value] of new Array(config.count).entries() ) {
            const card = new DuosideElement(config.same ? config.src : config.src + (index + 1) + '.png', { elementId: config.id, ...config.element }, config.flipped === undefined, config.duo);
            heap.add_element(card);
        }

        heap.shuffle();
        this.heaps.set(config.id, heap);
    }


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