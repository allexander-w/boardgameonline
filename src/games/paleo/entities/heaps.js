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
import DiceElement from "../../../entities/cards/dice";
import FieldElement from "../../../entities/cards/field";
import HandModule from "../../../modules/hand-module";

function PaleoHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, RotateRightModule, GroupDragModule);

    this.initialization = () => [SelectCardsModule, RotateRightModule, GroupDragModule]
        .forEach(module => module.initialization?.call(this));

    this.initialization();
    const game = board.get_layer("board");
    const fixedLayer = board.get_layer("fixed");


    const cards = [
        {folder: "1", count: 64, zero: true},
        {folder: "2", count: 40, zero: true},
        {folder: "3", count: 32, zero: true},
        {folder: "4", count: 16, zero: true},
        {folder: "5", count: 44, zero: true},
        {folder: "А", count: 18},
        {folder: "Б", count: 22},
        // {folder: "В", count: 20},
        // {folder: "Г", count: 22},
        // {folder: "Д", count: 24},
        // {folder: "Е", count: 34},
        // {folder: "Ж", count: 30},
        // {folder: "И", count: 28},
        // {folder: "К", count: 22},
        // {folder: "Л", count: 28},
        // {folder: "М", count: 36},
    ]


    /* Рендер основных карт */
    cards.forEach((config, i) => {
        const heapOptions = { x: -1000 + ( i * 430 ), y: 0, width: 331 + 20, height: 514 + 20 };
        const heap = new Heap(board, heapOptions, config.folder);

        let number = 1;
        for ( const [index, value] of new Array(config.count).entries() ) {
            if ( !((index + 1) % 2) ) continue;

            const id = config.folder + '_' + index;
            const elementPosition = { x: heapOptions.x + heapOptions.width / 2, y: heapOptions.y + heapOptions.height / 2  };
            const src = `/paleo/${ config.folder }/${ config.zero ? '0' : '' }${config.folder} (${ number }).jpg`;
            const bgSrc = `/paleo/${ config.folder }/${ config.zero ? '0' : '' }${config.folder} (${ number })-2.jpg`;

            const options =  { bgURI: bgSrc, draggable: true, id, isAbsoluteBgUri: true, parentID: config.folder, ...elementPosition, width: 331, height: 514, opacity: 1 };

            const card = new DuosideElement(src, options);
            heap.add_element(card, id);

            number ++;
        }

        this.heaps.set(config.folder, heap);
    })



    /* Рендер полей игроков */
    for ( const [index, value] of new Array(3).entries() ) {
        const src = '/paleo/fields/' + (index + 1) + '.png';
        const options =  { bgURI: null, draggable: false, x: -400 + (index * 1890), y: 3720, width: 1679, height: 1455, opacity: 1 };

        const card = new FieldElement(src, options);
        fixedLayer.add(card.element);
    }

    const table = new FieldElement('/paleo/fields/5.png', {
        bgURI: null, draggable: false,
        x: -400, y: 1720,
        width: 1394, height: 1820,
        opacity: 1
    });

    fixedLayer.add(table.element);

    const death = new FieldElement('/paleo/fields/4.png', {
        bgURI: null, draggable: false,
        x: 1394, y: 2020,
        width: 441 * 2, height: 600 * 2,
        opacity: 1
    });

    fixedLayer.add(death.element);



    /* Рендер изобретений */
    for ( const [index, value] of new Array(13).entries() ) {
        const src = '/paleo/creations/' + (index + 1) + '.png';
        const options =  { bgURI: null, id: "creations_" + index, draggable: true, custom: true, x: -1000 + (index * 250), y: 2850, width: 200, height: 200, opacity: 1 };

        for (let i = 0; i < 5; i++) {
            const card = new DuosideElement(src, options);
            game.add(card.element);
        }
    }



    /* Добавление модуля нотификаций для интерфейса */
    gameInterface.addModule("notifications", new NotificationsModule());

    /* Добавление модуля имитации рук */
    gameInterface.addModule("hand", new HandModule(board));

    /* Добавление модуля банка ресурсов для интерфейса */
    gameInterface.addModule("resources", new ResourcesBankModule(board));
    const resourcesModule = gameInterface.getModule("resources");
    const resources = [];

    for ( const [index, value] of new Array(5).entries() ) {
            let src = '/paleo/resources/' + (index + 1) + '.png';
            resourcesModule.addResource("resource_" + (index + 1), { src, width: 180, height: 180, count: 0 });
            resources.push({ id: "resource_" + (index + 1), count: 30 });
    }

    ws.receiver.send('api.bank.creation', { resources });



    /* Рендер костей */
    const dice = new DiceElement('/paleo/dice/1.png', { id: "dice1", custom: true });
    game.add(dice.element);

    /* Рендер костей */
    const dice2 = new DiceElement('/paleo/dice/1.png', { id: "dice2", custom: true });
    game.add(dice2.element);


    ws.emitter.on("rolled", (data) => {
        const dice = board.stage.findOne("#" + data.id);
        dice.fillPatternOffset({ x: (dice.width() * data.index) / dice.fillPatternScale().x, y: 0 });
        // dice.attrs.link.roll(null, data);
    })

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

export default PaleoHeaps;