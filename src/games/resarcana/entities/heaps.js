import Heaps from "../../../core/heaps";
import ws from "../../../core/websocket";
import SelectCardsModule from "../../../modules/select-card.module";
import PersonalCardsModule from "../../../modules/personal-card.module";
import RotateRightModule from "../../../modules/rotate-right.module";
import GroupDragModule from "../../../modules/group-drag.module";
import DuosideElement from "../../../entities/cards/duoside";
import Heap from "../../../entities/heaps/heap";

function ArcanaHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, PersonalCardsModule, RotateRightModule, GroupDragModule);

    this.initialization = () => [SelectCardsModule, PersonalCardsModule, RotateRightModule, GroupDragModule]
        .forEach(module => module.initialization?.call(this));

    this.initialization();
    const game = board.get_layer("board");


    /* Карты мест силы */
    const heapOptions = { x: 0, y: -1300, width: 819 + 20, height: 1161 + 20 };
    const heap = new Heap(board, heapOptions, 'powercard');

    for ( const [index, value] of new Array(10).entries() ) {
        if ( !((index + 1) % 2) ) continue;

        const id = 'powercard' + '_' + index;
        const elementPosition = { x: heapOptions.x + heapOptions.width / 2, y: heapOptions.y + heapOptions.height / 2  };
        const src = '/resarcana/powercard/' + (index + 1) + '.png';

        const options =  { bgURI: '/resarcana/powercard/' + (index + 2) + '.png', draggable: true, id, isAbsoluteBgUri: true, parentID: 'powercard', ...elementPosition, width: 819, height: 1161, opacity: 1 };

        const card = new DuosideElement(src, options);
        heap.add_element(card, id);
    }

    this.heaps.set('powercard', heap);



    for ( const [index, value] of new Array(6).entries() ) {
            let src = '/resarcana/essentions/' + (index + 1) + '.png';

            for (let j = 0; j < 30; j++) {
                const options =  { bgURI: null, x: 700 + (index * 140), y: 1200, draggable: true, width: 120, height: 120, cornerRadius: 0, custom: true };
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

export default ArcanaHeaps;