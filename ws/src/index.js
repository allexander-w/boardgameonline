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

        const router = Router(data);

        router.use( actions.connected, async (data) => {
                const user = new User(Date.now(), connection);
                user.setName(data.payload?.name || "");
                users.push(user);

                if ( !syncUser ) {
                    syncUser = user.id;
                }

                console.log(users);
                user.send(actions.connected, { user: user, message: "connected" });

                users.forEach(u => {
                    if (u.id === data.payload.user) return false;
                    u.send(actions.join, { user, users, syncUser: syncUser });
                });

        })

        router.redirect(actions.mousemove, users);
        router.redirect(actions.flip, users);
        router.redirect(actions.dragmove, users);
        router.redirect(actions.dragend, users);
        router.redirect("dragstart", users);
        router.redirect(actions.sync, users);
        router.redirect('shuffle', users);
        router.redirect('entire', users);
        router.redirect('shuffle_end', users);
        router.redirect('select', users);
        router.redirect('translate', users);
        router.redirect('groupmove', users);
        router.redirect('movetop', users);
        router.redirect('roll', users);
        router.redirect('rolled', users);
        router.redirect('rotate', users);

        router.use('hide', (data) => {
            const user = users.find(element => element.id === data.payload.user);
            if ( !user ) return;

            user.hide(data.payload.id);

            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send('hide', { user, hiddens: user.hiddens, id: data.payload.id });
            });
        })

        router.use('show', (data) => {
            const user = users.find(element => element.id === data.payload.user);
            if ( !user ) return;

            user.show(data.payload.id);

            users.forEach(u => {
                if (u.id === data.payload.user) return false;
                u.send('show', { user, hiddens: user.hiddens, id: data.payload.id });
            });
        })

        // router.redirect('hide', users);
        // router.redirect('show', users);
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

        console.log("Disconnnect");

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