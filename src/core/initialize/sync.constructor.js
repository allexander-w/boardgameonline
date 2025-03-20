import ws from "../websocket";

function SyncState(board, heaps) {


    /* Возвращает все айдишники скрытых карт игроков */
    const getAllHiddensCardIds = (users) => {
        const output = new Set();

        for ( const user of users ) {
            for ( const hide of user.hidden ) {
                output.add(hide);
            }
        }

        return output;
    }



    /* Отправка файла синхронизации */
    ws.emitter.on("SYNC", ({ user, users }) => {
        if ( ws.currentConnection !== user ) return false;
        const hiddenIds = getAllHiddensCardIds(users);
        const configs = {};

        for ( const [key, l] of board.layers.entries() ) {
            if ( key === 'cursors' ) continue;

            const config = l.children.map(child => {
                if ( child.attrs.resource_id ) {
                    console.log("from form", child);
                    return {
                        x: child.attrs.x,
                        y: child.attrs.y,
                        zindex: child.zIndex(),
                        rotation: child.rotation(),
                        id: child.id(),
                        innerID: child._id,
                        resource_id: child.attrs.resource_id,
                        src: child.attrs.src,

                        parentID: child.attrs.parentID,
                        elementID: child.attrs.id
                    }
                }

                return {
                    x: child.attrs.x,
                    y: child.attrs.y,
                    zindex: child.zIndex(),
                    rotation: child.rotation(),
                    id: child.id(),
                    innerID: child._id,
                    resource_id: child.attrs.resource_id,

                    hidden: hiddenIds.has(child._id),
                    flipped: child.attrs.flipped,

                    parentID: child.attrs.parentID,
                    elementID: child.attrs.id
                }
            });

            configs[key] = config;
        }

        ws.receiver.send('sync', { configs });
        ws.emitter.emit("synced", { synced: true });
    })



    /* Синхронизация */
    ws.emitter.on('sync', (data) => {
        if ( ws.currentSynced ) return false;

        for ( const [key, config] of Object.entries(data.configs) ) {
            for ( const config_item of config || [] ) {
                const l = board.get_layer(key);
                // const child = l.findOne("#" + config_item.id);

                const child = l.children.find(el => el._id === config_item.innerID);

                if ( child ) {
                    child.x(config_item.x);
                    child.y(config_item.y);
                    child.zIndex(config_item.zindex);
                    child.rotation(config_item.rotation);
                    child.id(config_item.id);

                    if ( config_item.flipped !== undefined && config_item.parentID ) {
                        const heap = heaps.get(config_item.parentID);
                        const element = heap.get_element(config_item.elementID);

                        config_item.flipped ? element.flipToTop() : element.flipOnBottom();
                    }

                    if ( config_item.hidden ) {
                        child.hide();
                    }
                }

                if ( config_item.resource_id ) {
                    console.log("from sync:", config_item);

                    ws.emitter.emit("api.bank.table", {
                        entries: [
                            [config_item.resource_id,
                                {
                                    src: config_item.src,
                                    custom: true,
                                    resource_id: config_item.resource_id,
                                    x: config_item.x, y: config_item.y,
                                    id: config_item.id
                                }
                            ]
                        ]
                    })
                }
            }
        }

        ws.currentSynced = true;
        ws.emitter.emit("synced", { synced: true });
    })
}

export default SyncState;