const PLAYER_COMMANDS = new Set([
    "api.register.joined",
    "api.register.sync",
    "api.cursors.move",
    "api.drag.start",
    "api.drag.move",
    "api.drag.end",
    "api.cards.action",
    "modules.hand.take",
    "modules.hand.takeAll",
    "modules.hand.takeHalf",
    "modules.hand.put",
    "modules.hand.putById",
    "modules.resources.put",
    "api.room.checkpoint",
]);

const HOST_COMMANDS = new Set([
    "api.room.kick",
    "api.room.transferHost",
]);

function isAllowed(action, role) {
    if ( HOST_COMMANDS.has(action) ) return role === "host";
    return PLAYER_COMMANDS.has(action);
}

module.exports = { isAllowed, PLAYER_COMMANDS, HOST_COMMANDS };