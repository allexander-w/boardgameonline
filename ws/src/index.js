const ws = require("./core/websockets");
const { unserialize } = require("../../shared/utils/serialize.util.cjs");

const Router = require("./models/router.model");
const User = require("./models/user.model");

const actions = require("../../shared/actions/action.types.cjs");
let users = [];
let syncUser = null;

ws.on("request", req => {
    const connection = req.accept("", req.origin);

    /* [Жизненный цикл]: Процесс взаимодействия */
    connection.on("message", async msg => {
        const propertyName = msg.type + "Data";
        const data = unserialize(msg[propertyName]);

        const router = new Router(data);

        router.use( actions.connected, async (data) => {
                const user = new User(Date.now(), connection);
                users.push(user);

                if ( !syncUser ) {
                    syncUser = user.id;
                }

                user.send(actions.connected, { user: user.id, message: "connected" });
                users.forEach(u => u.send(actions.join, { user: user.id, users, syncUser: syncUser }));
        })

        router.use(actions.mousemove, ( data ) => {
            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send(actions.mousemove, { user: data.payload.user, x: data.payload.x, y: data.payload.y })
            });
        })

        router.use(actions.flip, ( data ) => {
            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send(actions.flip, { user: data.payload.user, id: data.payload.id });
            });
        })

        router.use(actions.dragmove, ( data ) => {
            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send(actions.dragmove, data.payload);
            });
        })

        router.use('sync', ( data ) => {
            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send('sync', data.payload);
            });
        })

        router.use('dragend', ( data ) => {
            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send('dragend', data.payload);
            });
        })
    });

    /* [Жизненный цикл]: Дисконнект игрока */
    connection.on("close", async (msg, reason) => {

        /* [Дисконнект]: Получение удаленного пользователя */
        const disconnectedUser = users.find(user => !user.connected);

        /* [Дисконнект]: Если пользователь неопределен */
        if ( !disconnectedUser ) {
            console.log("Disconnected user is not found");
            return false;
        }

        /* [Дисконнект]: Если пользователь определен */
        users = users.filter(user => user.id !== disconnectedUser.id);
        if ( syncUser === disconnectedUser.id ) {
            syncUser = users[0]?.id || null;
        }

        for ( const user of users ) {
            user.send(actions.disconnect, disconnectedUser);
        }
    })
});