const ws = require("./core/websockets");
const { unserialize } = require("../../shared/utils/serialize.util.cjs");

const User = require("./models/user.model");
const RoomStore = require("./models/room.store");
const { isAllowed } = require("./commands");

const roomStore = new RoomStore();

function handleConnected(connection, data) {
    const roomId = String(data.payload?.room || "default");
    const room = roomStore.getOrCreate(roomId);

    const user = new User(Date.now(), connection);
    user.setName(data.payload?.name || "");
    user.setAvatar(data.payload?.avatar || "");

    connection.roomId = roomId;
    connection.userId = user.id;

    room.addUser(user);

    user.send("api.register.connected", { user, room: roomId, message: "connected" });
    room.broadcast("api.register.join", { user, users: room.users, syncUser: room.syncUser });
}

function handleKick(room, actingUser, data) {
    const target = room.getUser(data.payload?.target);
    if ( !target || target.id === actingUser.id ) return;

    target.send("api.room.kicked", {});
    target.connection.close();
}

function handleTransferHost(room, data) {
    const target = room.getUser(data.payload?.target);
    if ( !target ) return;

    room.syncUser = target.id;
    room.refreshRoles();
    room.broadcast("api.room.hostChanged", { syncUser: room.syncUser, users: room.users });
}

ws.on("request", req => {
    const connection = req.accept("", req.origin);

    connection.on("message", async msg => {
        const propertyName = msg.type + "Data";
        const data = unserialize(msg[propertyName]);
        if ( !data || !data.action ) return;

        if ( data.action === "api.register.connected" ) {
            return handleConnected(connection, data);
        }

        const room = roomStore.get(connection.roomId);
        if ( !room ) return;

        const actingUser = room.getUser(connection.userId);
        if ( !actingUser ) return;

        if ( !isAllowed(data.action, actingUser.role) ) {
            actingUser.send("api.room.rejected", { action: data.action });
            return;
        }

        if ( data.action === "api.room.kick" ) {
            return handleKick(room, actingUser, data);
        }

        if ( data.action === "api.room.transferHost" ) {
            return handleTransferHost(room, data);
        }

        room.broadcast(data.action, { ...data.payload, user: actingUser.id }, actingUser.id);
    });

    connection.on("close", async () => {
        const room = roomStore.get(connection.roomId);
        if ( !room ) return;

        const disconnectedUser = room.getUser(connection.userId);
        if ( !disconnectedUser ) return;

        room.removeUser(disconnectedUser.id);
        room.broadcast("api.register.disconnect", disconnectedUser);

        if ( room.isEmpty ) {
            roomStore.delete(room.id);
        }
    });
});