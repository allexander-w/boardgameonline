const ws = require("./core/websockets");
const { unserialize } = require("../../shared/utils/serialize.util.cjs");

const User = require("./models/user.model");
const RoomStore = require("./models/room.store");
const database = require("./storage/database");
const { isAllowed } = require("./commands");

const roomStore = new RoomStore();

setInterval(() => {
    for ( const room of roomStore.rooms.values() ) {
        database.saveRoom(room.id, room.name, room.getPersistableState());
    }
}, 30000);

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

    if ( room.users.length === 1 && room.hasState() ) {
        user.send("api.register.sync", room.getSyncPayload());
    }

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

function trackHandOwnership(room, actingUser, data) {
    if ( data.action === "modules.hand.take" ) {
        room.takeToHand(data.payload.id, actingUser.id);
    }

    if ( data.action === "modules.hand.takeAll" || data.action === "modules.hand.takeHalf" ) {
        for ( const cardId of data.payload.cards || [] ) {
            room.takeToHand(cardId, actingUser.id);
        }
    }

    if ( data.action === "modules.hand.put" ) {
        for ( const card of data.payload.cards || [] ) {
            room.releaseFromHand(card.id);
        }
    }

    if ( data.action === "modules.hand.putById" ) {
        room.releaseFromHand(data.payload.card.id);
    }
}

const HAND_ACTIONS = new Set([
    "modules.hand.take",
    "modules.hand.takeAll",
    "modules.hand.takeHalf",
    "modules.hand.put",
    "modules.hand.putById",
]);

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

        if ( HAND_ACTIONS.has(data.action) ) {
            trackHandOwnership(room, actingUser, data);
            room.broadcast(data.action, { ...data.payload, user: actingUser.id }, actingUser.id);
            room.broadcast("api.room.handCounts", { counts: room.getHandCounts() });
            return;
        }

        if ( data.action === "api.register.sync" ) {
            room.checkpoint(data.payload);
            room.broadcast(data.action, { ...data.payload, user: actingUser.id, hands: room.getHandIds() }, actingUser.id);
            return;
        }

        if ( data.action === "api.room.checkpoint" ) {
            room.checkpoint(data.payload);
            return;
        }

        room.broadcast(data.action, { ...data.payload, user: actingUser.id }, actingUser.id);
    });

    connection.on("close", async () => {
        const room = roomStore.get(connection.roomId);
        if ( !room ) return;

        const disconnectedUser = room.getUser(connection.userId);
        if ( !disconnectedUser ) return;

        const releasedCards = room.releaseUserHands(disconnectedUser.id);

        room.removeUser(disconnectedUser.id);
        room.broadcast("api.register.disconnect", disconnectedUser);

        if ( releasedCards.length ) {
            room.broadcast("modules.hand.released", { cards: releasedCards });
            room.broadcast("api.room.handCounts", { counts: room.getHandCounts() });
        }

        if ( room.isEmpty ) {
            roomStore.persistAndEvict(room);
        }
    });
});