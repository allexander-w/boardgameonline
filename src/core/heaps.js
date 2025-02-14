import DuosideElement from "../entities/cards/duoside";
import Heap from "../entities/heaps/heap";
import entitiesConfig from "../config/entities.config.js";
import Konva from "konva";

import ws from "./websocket";
import actions from "../../shared/actions/action.types.mjs";

function Heaps(game, board) {
    this.heaps = new Map();
    const stage = board.stage;


    for ( const config of entitiesConfig ) {
        const heap = new Heap(game, config.heap_config, config.id);
        for ( const [index, value] of new Array(config.count).entries() ) {
            const card = new DuosideElement(config.same ? config.src : config.src + (index + 1) + '.png', { elementId: config.id, numId: config.id + '_' + index, ...config.element }, config.flipped, config.duo, config.id + '_' + index);
            heap.add_element(card, config.id + '_' + index);
        }

        this.heaps.set(config.id, heap);
    }


    /* Отправка файла синхронизации */
    ws.emitter.on("SYNC", ({ user, users }) => {
        if ( ws.currentConnection === user ) {
            const hiddenIds = new Set();

            for ( const u of users ) {
                for ( const hide of u.hidden ) {
                    hiddenIds.add(hide);
                }
            }

            console.log("after sync: ", hiddenIds);

            setTimeout(() => {

                const configs = {};

                for ( const [key, l] of board.layers.entries() ) {
                    if ( key === 'cursors' ) continue;

                    const config = l.children.map(child => ({
                        id: child._id,
                        x: child.attrs.x,
                        y: child.attrs.y,
                        zindex: child.zIndex(),
                        elementId: child.attrs.elementId,
                        fillPatternOffset: child.fillPatternOffset(),
                        rotation: child.rotation(),
                        hidden: hiddenIds.has(child._id)
                    }));

                    configs[key] = config;
                }

                ws.receiver.send('sync', { configs });


            }, 1000)
        }
    })


    /* Синхронизация */
    ws.emitter.on('sync', (data) => {

        if ( ws.currentSynced ) return false;

        for ( const [key, config] of Object.entries(data.configs) ) {
            for ( const config_item of config || [] ) {
                const l = board.get_layer(key);
                const child = l.children.find(el => el._id === config_item.id);

                if ( child ) {
                    child.x(config_item.x);
                    child.y(config_item.y);
                    child.zIndex(config_item.zindex);
                    child.fillPatternOffset(config_item.fillPatternOffset);
                    child.rotation(config_item.rotation);

                    if ( config_item.hidden ) {
                        child.hide();
                    }
                }
            }
        }

        ws.currentSynced = true;
    })


    /* Переворот карточки */
    ws.emitter.on(actions.flip, (data) => {
        const heap_id = data.id.split("_")[0];
        const heap = this.heaps.get(heap_id);

        const element = heap.get_element(data.id);
        element.flipElement(false);
    });

    /* Шафл */
    ws.emitter.on('shuffle', (data) => {
        const heap = this.heaps.get(data.heap_id);
        heap.shuffle(null, true);
    });

    ws.emitter.on('shuffle_end', (data) => {
        const heap = this.heaps.get(data.heap_id);

        for ( const config_item of data.sync_config || [] ) {
            const el = heap.get_element(config_item.id);
            el.element.zIndex(config_item.zindex);
        }
    });


    stage.on('dragstart', (e) => {
        if ( e.target.attrs.elementId ) {
            ws.emitter.emit("DRAGSTART", e);

            e.target.to({
                scaleX: 1.2,
                scaleY: 1.2,
                shadowColor: "rgba(0, 0, 0, 0.9)",
                shadowBlur: 20,
                shadowOpacity: 1,

                duration: 0.2, // Длительность анимации
                easing: Konva.Easings.EaseOut
            });
        }
    })


    /* [DRAGMOVE]: Отправка данных */
    stage.on('dragmove', (e) => {
        if ( e.target.attrs.elementId ) {
            ws.emitter.emit("DRAGMOVE", e);

            ws.receiver.send(actions.dragmove, { x: e.target.attrs.x, y: e.target.attrs.y, id: e.target._id });
            ws.receiver.send(actions.mousemove, { x: e.target.attrs.x, y: e.target.attrs.y });
        }
    })

    /* [DRAGMOVE]: Принятие данных */
    ws.emitter.on(actions.dragmove, (data) => {
        const element = game.children.find(el => el._id === data.id);
        element.x(data.x);
        element.y(data.y);
    });


    /* [DRAGEND]: Отправка данных */
    stage.on('dragend', (e) => {
        if ( e.target.attrs.elementId ) {
            e.target.to({
                scaleX: 1,
                scaleY: 1,
                shadowColor: "rgba(0, 0, 0, 0)",
                shadowBlur: 0,
                shadowOpacity: 0,

                duration: 0.2, // Длительность анимации
                easing: Konva.Easings.EaseIn
            });

            // const heap = this.heaps.get(e.target.attrs.elementId);
            // heap.check_chip_position(e);

            ws.emitter.emit("DRAGEND", e);
            ws.receiver.send('dragend', { id: e.target._id });
        }
    })


}

export default Heaps;