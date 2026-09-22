const ws = require("./core/websockets");
const { unserialize } = require("../../shared/utils/serialize.util.cjs");

const Router = require("./models/router.model");
const User = require("./models/user.model");
const RoomStore = require("./models/room.store");

const roomStore = new RoomStore();

ws.on("request", req => {
    const connection = req.accept("", req.origin);

    connection.on("message", async msg => {
        const propertyName = msg.type + "Data";
        const data = unserialize(msg[propertyName]);

        const router = Router(data);

        router.use("api.register.connected", async (data) => {
            const roomId = String(data.payload?.room || "default");
            const room = roomStore.getOrCreate(roomId);

            const user = new User(Date.now(), connection);
            user.setName(data.payload?.name || "");
            user.setAvatar(data.payload?.avatar || "");

            connection.roomId = roomId;
            connection.userId = user.id;

            room.addUser(user);

            user.send("api.register.connected", { user, room: roomId, message: "connected" });
            room.broadcast("api.register.join", { user, users: room.users, syncUser: room.syncUser }, user.id);
        });

        if ( data.action === "api.register.connected" ) {
            return false;
        }

        const room = roomStore.get(connection.roomId);
        if ( !room ) return false;

        router.redirect(data.action, room.users);
    });

    connection.on("close", async () => {
        const room = roomStore.get(connection.roomId);
        if ( !room ) return false;

        const disconnectedUser = room.getUser(connection.userId);
        if ( !disconnectedUser ) return false;

        room.removeUser(disconnectedUser.id);
        room.broadcast("api.register.disconnect", disconnectedUser);

        if ( room.isEmpty ) {
            roomStore.delete(room.id);
        }
    });
});