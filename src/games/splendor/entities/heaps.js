import Heaps from "../../../core/heaps";
import ws from "../../../core/websocket";
import SelectCardsModule from "../../../modules/select-card.module";
import PersonalCardsModule from "../../../modules/personal-card.module";
import RotateCardsModule from "../../../modules/rotate-card.module";
import DuosideElement from "../../../entities/cards/duoside";

function SplendorHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, PersonalCardsModule, RotateCardsModule);

    this.initialization = () => [SelectCardsModule, PersonalCardsModule, RotateCardsModule]
        .forEach(module => module.initialization?.call(this));

    this.initialization();
    const game = board.get_layer("board");


    for ( const [index, value] of new Array(6).entries() ) {
        let src = '/splendor/jewelry/' + (index + 1) + '.png';

        for (let j = 0; j < 4; j++) {
            const options =  { bgURI: null, x: 300 + (index * 340), y: 2200, draggable: true, width: 300, height: 300, cornerRadius: 0, custom: true };
            const card = new DuosideElement(src, options);
            game.add(card.element);
        }
    }


    ws.emitter.on("DRAGSTART", (e) => {
        if ( e.target.attrs.parentID || e.target.attrs.custom ) {
            e.target.moveToTop();
        }
    })

    ws.emitter.on("dragstart", ({ id }) => {
        const el = game.children.find(el => el._id === id);
        if ( el ) el.moveToTop();
    })
}

export default SplendorHeaps;