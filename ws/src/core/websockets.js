const Websocket = require("websocket").server;
const server = require("./server")

const ws = new Websocket({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64 * 1024 * 1024,  // 64MB (по умолчанию 64KB)
    maxReceivedMessageSize: 64 * 1024 * 1024, // 64MB
});

module.exports = ws;