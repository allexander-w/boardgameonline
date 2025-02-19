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

        setTimeout(() => {
            const configs = {};

            for ( const [key, l] of board.layers.entries() ) {
                if ( key === 'cursors' ) continue;

                const config = l.children.map(child => ({
                    x: child.attrs.x,
                    y: child.attrs.y,
                    zindex: child.zIndex(),
                    rotation: child.rotation(),
                    id: child._id,

                    hidden: hiddenIds.has(child._id),
                    flipped: child.attrs.flipped,

                    parentID: child.attrs.parentID,
                    elementID: child.attrs.id
                }));

                configs[key] = config;
            }

            ws.receiver.send('sync', { configs });
        }, 1000)
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
                    child.rotation(config_item.rotation);


                    if ( config_item.flipped !== undefined && config_item.parentID ) {
                        const heap = heaps.get(config_item.parentID);
                        const element = heap.get_element(config_item.elementID);

                        config_item.flipped ? element.flipToTop() : element.flipOnBottom();
                    }

                    if ( config_item.hidden ) {
                        child.hide();
                    }
                }
            }
        }

        ws.currentSynced = true;
    })
}

export default SyncState;