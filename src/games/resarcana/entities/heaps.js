import Heaps from "../../../core/heaps";
import ws from "../../../core/websocket";
import SelectCardsModule from "../../../modules/select-card.module";
import PersonalCardsModule from "../../../modules/personal-card.module";
import RotateRightModule from "../../../modules/rotate-right.module";
import GroupDragModule from "../../../modules/group-drag.module";
import DuosideElement from "../../../entities/cards/duoside";
import Heap from "../../../entities/heaps/heap";
import gameInterface from "../../../modules/interface-module";
import NotificationsModule from "../../../modules/notifications-module";
import ResourcesBankModule from "../../../modules/resources-module";

function ArcanaHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, RotateRightModule, GroupDragModule);

    this.initialization = () => [SelectCardsModule, RotateRightModule, GroupDragModule]
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



    /* Добавление модуля нотификаций для интерфейса */
    gameInterface.addModule("notifications", new NotificationsModule());



    /* Добавление модуля банка ресурсов для интерфейса */
    gameInterface.addModule("resources", new ResourcesBankModule(board));
    const resourcesModule = gameInterface.getModule("resources");
    const resources = [];

    for ( const [index, value] of new Array(5).entries() ) {
            let src = '/resarcana/essentions/' + (index + 1) + '.png';
            resourcesModule.addResource("essention_" + (index + 1), { src, width: 120, height: 120, count: 0 });
            resources.push({ id: "essention_" + (index + 1), count: 30 });
    }

    ws.receiver.send('api.bank.creation', { resources });


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