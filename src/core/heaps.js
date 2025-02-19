import Heap from "../entities/heaps/heap";
import SyncState from "./initialize/sync.constructor";
import HeapEvents from "../entities/events/heap.events";
import CardEvents from "../entities/events/card.events";
import DuosideElement from "../entities/cards/scythe/duoside.constructor";

import {getContentUri} from "../utils/contentUriCreator";

import projectConfig from "../config";
// import entitiesConfig from "../config/entities.config.js";

function Heaps(board, entitiesConfig) {
    this.game = board.get_layer('board');
    this.board = board;

    this.heaps = new Map();

    /* Создание карточек по конфигу */
    for ( const config of entitiesConfig ) {

        const heapOptions = { x: config.x, y: config.y, width: config.element.width + 20, height: config.element.height + 20 };
        const heap = new Heap(board, heapOptions, config.namespace);


        for ( const [index, value] of new Array(config.count).entries() ) {

            const elementPosition = { x: heapOptions.x + heapOptions.width / 2, y: heapOptions.y + heapOptions.height / 2  };
            const id = config.namespace + '_' + index;
            const uri = getContentUri(projectConfig.scene, config.namespace);
            const src = config.same ? uri + config.same : config.loop ? uri + config.loop : uri + (index + 1) + '.png';
            const options =  { bgURI: config.duo ? null : uri, parentID: config.namespace, flipped: config.flipped, id,  ...config.element, ...elementPosition };

            const card = new DuosideElement(src, options);
            heap.add_element(card, id);

        }

        this.heaps.set(config.namespace, heap);
    }

    /* Синхронизация состояния подключенного */
    new SyncState(board, this.heaps);

    /* Принятие ивентов из стопок */
    new HeapEvents(this.heaps);

    /* Принятие ивентов из карточек */
    new CardEvents(this.heaps);
}

export default Heaps;