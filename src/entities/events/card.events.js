import ws from "../../core/websocket";
import actions from "../../../shared/actions/action.types.mjs";

function CardEvents(heaps) {
    /* Переворот карточки */
    ws.emitter.on(actions.flip, (data) => {
        const heap = heaps.get(data.heap);
        const element = heap.get_element(data.id);

        element.flipElement(false);
    });

    ws.emitter.on("rotate", (data) => {
        const heap = heaps.get(data.heap);
        const element = heap.get_element(data.id);

        element.rotate({}, true);
    });
}

export default CardEvents;