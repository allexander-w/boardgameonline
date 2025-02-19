import DuosideElement from "../../../entities/cards/scythe/duoside.constructor";
import Heaps from "../../../core/heaps";
import PersonalCardsModule from "../../../modules/personal-card.module";
import SelectCardsModule from "../../../modules/select-card.module";

function ScytheHeaps(board, config) {
    Heaps.apply(this, arguments);
    Object.assign(this, SelectCardsModule, PersonalCardsModule);
    this.initialization();


    const game = board.get_layer("board");
    const fixedLayout = board.get_layer("fixed");

    const coordinates = [{ x: 700, y: 460 }, { x: 1325, y: 460 }, { x: 700, y: 1005 }, { x: 1325, y: 1005 }]
    let i = 5;

    for ( const [index, value] of new Array(4).entries() ) {
        if ( i > 7 ) {
            i = 0;
        }

        const src = '/scythe/tiles/' + (i + 1) + '.png';
        const options =  { bgURI: null, draggable: false, x: coordinates[index].x, y: coordinates[index].y, width: 472, height: 460, opacity: 0.8 };

        const card = new DuosideElement(src, options);
        game.add(card.element);
        i ++;
    }


    const chipsCount = [{ count: 7, size: 50 }, { count: 8, size: 40 }, { count: 6, size: 40 }, { count: 6, size: 27 }, { count: 4, size: 40 }]

    let row = 0;
    let col = 1;

    for ( const [index, value] of new Array(5).entries() ) {
        let src = '/scythe/chips/' + (index + 1) + '/';

        for (let i = 0; i < 5; i++) {
            let count = chipsCount[i]

            for (let j = 0; j < count.count; j++) {
                const options =  { bgURI: null, x: -1500 + (index * 1000) + (j * 70), y: 2500 + (i * 70), draggable: true, width: count.size, height: count.size, cornerRadius: 0, custom: true };
                const card = new DuosideElement(src + (i + 1) + '/' + (j + 1) + '.png', options);
                game.add(card.element);
            }
        }
    }

    col = 0;
    for ( const [index, value] of new Array(5).entries() ) {
        const src = '/scythe/tables/' + (index + 1) + '.png';
        const options =  { bgURI: null, x: -1100 + (col * 1000), y: 2100, draggable: false, width: 905, height: 640, cornerRadius: 0, custom: true };

        const card = new DuosideElement(src, options);
        fixedLayout.add(card.element);
        card.element.moveToBottom();

        col ++;
    }



    col = 0;
    for ( const [index, value] of new Array(5).entries() ) {
        const src = '/scythe/mex/' + (index + 1) + '.png';
        const options =  { bgURI: null, x: -1078 + (col * 1000), y: 1700, draggable: true, width: 100, height: 100, cornerRadius: 0, custom: true };

        for ( const [j ,el] of new Array(4).entries() ) {
            const card = new DuosideElement(src, options);
            game.add(card.element);

            card.element.x(card.element.x() + (j * 118));

            setTimeout(() => {
                card.element.moveToTop();
            }, 1)
        }

        if ( col > 4 ) {
            row ++;
            col = 0;
        }

        col ++;
    }


    for (let i = 0; i < 2; i++) {
        const options =  { bgURI: null, x: 2300, y: 210 + (i * 400), draggable: false, width: 677, height: 390, cornerRadius: 0, custom: true };
        const card = new DuosideElement( '/scythe/warTablet/' + (i + 1) + '.png', options);
        fixedLayout.add(card.element);
    }
}

export default ScytheHeaps;