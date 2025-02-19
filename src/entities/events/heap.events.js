import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";

function HeapEvents(heaps) {

    /* Карточки в стопку */
    ws.emitter.on('entire', (data) => {
        const heap = heaps.get(data.heap_id);
        heap.entire(null, true);
    });

    /* Шафл */
    ws.emitter.on('shuffle', (data) => {
        const heap = heaps.get(data.heap_id);
        heap.shuffle(null, true);
    });

    /* Шафл завершен */
    ws.emitter.on('shuffle_end', (data) => {
        const heap = heaps.get(data.heap_id);

        for ( const config_item of data.sync_config || [] ) {
            const el = heap.get_element(config_item.id);
            el.element.zIndex(config_item.zindex);
        }
    });

}

export default HeapEvents;