import Heaps from "../../../core/heaps";
import SelectCardsModule from "../../../modules/select-card.module";
import PersonalCardsModule from "../../../modules/personal-card.module";
import DuosideElement from "../../../entities/cards/duoside";
import ws from "../../../core/websocket";

function VineHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, PersonalCardsModule);

    this.initialization = () => [SelectCardsModule, PersonalCardsModule]
        .forEach(module => module.initialization?.call(this));

    this.initialization();

    const game = board.get_layer("board");
    const fixedLayer = board.get_layer("fixed");

    for ( const [index, value] of new Array(4).entries() ) {
        const src = '/vine/fields/' + (index + 1) + '.png';
        const options =  { bgURI: null, draggable: false, x: -1320 + (index * 1890), y: 3000, width: 1123, height: 794, opacity: 1 };

        const card = new DuosideElement(src, options);
        fixedLayer.add(card.element);
    }


    for ( const [index, value] of new Array(3).entries() ) {
        const src = '/vine/plot/' + (index + 1) + '/1.png';
        const bgSrc = '/vine/plot/' + (index + 1) + '/';
        const options =  { bgURI: bgSrc, draggable: true, x: 3300 + (index * 300), y: 175, width: 253, height: 349, opacity: 1, custom: true, cornerRadius: 10 };

        for (let i = 0; i < 4; i++) {
            const card = new DuosideElement(src, options);
            game.add(card.element);
        }
    }


    const chipsCount = [8, 6, 4];
    for ( const [index, value] of new Array(5).entries() ) {
        let src = '/vine/chip/' + (index + 1) + '/';

        for (let i = 0; i < 3; i++) {
            let count = chipsCount[i]

            for (let j = 0; j < count; j++) {
                const options =  { bgURI: null, x: -1800 + (index * 1900) + (j * 110), y: 3500 + (i * 110), draggable: true, width: 90, height: 90, cornerRadius: 5, custom: true };
                const card = new DuosideElement(src + (i + 1) + '/' + (j + 1) + '.png', options);
                game.add(card.element);
            }
        }
    }

    function addChip(src, opts) {
        let season = src;
        const options =  { bgURI: null, x: -200, y: 2300, draggable: true, width: 90, height: 90, cornerRadius: 5, custom: true, ...opts };
        const card = new DuosideElement(season, options);
        game.add(card.element);
    }

    addChip('/vine/chip/104.png', { x: -200, y: 1500 });
    addChip('/vine/chip/103.png', { x: -200, y: 1400 });

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

export default VineHeaps;