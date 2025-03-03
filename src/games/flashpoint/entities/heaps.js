import Heaps from "../../../core/heaps";
import ws from "../../../core/websocket";

function FlashpointHeaps(board, config) {
    Heaps.apply(this, arguments);

    const game = board.get_layer("board");

    ws.emitter.on("DRAGSTART", (e) => {
        if ( e.target.attrs.parentID ) {
            e.target.moveToTop();
        }
    })

    ws.emitter.on("dragstart", ({ id }) => {
        const el = game.children.find(el => el._id === id);
        if ( el ) el.moveToTop();
    })
}

export default FlashpointHeaps;