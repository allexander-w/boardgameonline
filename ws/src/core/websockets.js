const Websocket = require("websocket").server;
const server = require("./server")

const ws = new Websocket({
    httpServer: server,
    autoAcceptConnections: false
});

module.exports = ws;