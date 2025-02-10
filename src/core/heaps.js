import DuosideElement from "../entities/cards/duoside";
import Heap from "../entities/heaps/heap";
import entitiesConfig from "../config/entities.config.js";
import Konva from "konva";

import ws from "./websocket";
import actions from "../../shared/actions/action.types.mjs";

function Heaps(game, stage) {
    this.heaps = new Map();

    for ( const config of entitiesConfig ) {
        const heap = new Heap(game, config.heap_config);
        for ( const [index, value] of new Array(config.count).entries() ) {
            const card = new DuosideElement(config.same ? config.src : config.src + (index + 1) + '.png', { elementId: config.id, numId: config.id + '_' + index, ...config.element }, config.flipped, config.duo, config.id + '_' + index);
            heap.add_element(card, config.id + '_' + index);
        }

        this.heaps.set(config.id, heap);
    }


    ws.emitter.on("SYNC", ({ user }) => {
        if ( ws.currentConnection === user ) {
            const config = game.children.map(child => ({ id: child._id, x: child.attrs.x, y: child.attrs.y, zindex: child.zIndex(), elementId: child.attrs.elementId, flipped: child.attrs.flipped, numId: child.attrs.numId }));
            ws.receiver.send('sync', { config });
        }
    })

    ws.emitter.on('sync', (data) => {
        for ( const config_item of data.config || [] ) {
            const child = game.children.find(el => el._id === config_item.id);
            if ( child ) {
                child.x(config_item.x);
                child.y(config_item.y);
                child.zIndex(config_item.zindex);

                if ( config_item.elementId ) {
                    const heap_id = config_item.elementId.split("_")[0];
                    const heap = this.heaps.get(heap_id);

                    const element = heap.get_element(config_item.numId);

                    if ( element ) {
                        config_item.flipped ?  element.flipOnBottom() : element.flipToTop();
                    }
                }
            }
        }
    })

    ws.emitter.on("flip", (data) => {
        const heap_id = data.id.split("_")[0];
        const heap = this.heaps.get(heap_id);

        const element = heap.get_element(data.id);
        element.flipElement(false);
    });

    ws.emitter.on("dragmove", (data) => {
        const element = game.children.find(el => el._id === data.id);
        element.x(data.x);
        element.y(data.y);
    });

    stage.on('dragstart', (e) => {
        if ( e.target.attrs.elementId ) {
            e.target.to({
                scaleX: 1.2,
                scaleY: 1.2,
                shadowColor: "rgba(0, 0, 0, 0.9)",
                shadowBlur: 20,
                shadowOpacity: 1,

                duration: 0.2, // Длительность анимации
                easing: Konva.Easings.EaseOut
            });

            e.target.moveToTop();
        }
    })

    stage.on('dragmove', (e) => {
        if ( e.target.attrs.elementId ) {
            ws.receiver.send(actions.dragmove, { x: e.target.attrs.x, y: e.target.attrs.y, id: e.target._id });
            ws.receiver.send(actions.mousemove, { x: e.target.attrs.x, y: e.target.attrs.y });
        }
    })

    ws.emitter.on('dragend', (data) => {
        const element = game.children.find(el => el._id === data.id);
        console.log(element);
        element.moveToTop();
    })

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

            const heap = this.heaps.get(e.target.attrs.elementId);
            heap.check_chip_position(e);

            ws.receiver.send('dragend', { id: e.target._id });
        }
    })
}

export default Heaps;