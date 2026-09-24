const http = require("http");
const config = require("../../config");
const database = require("../storage/database");

const server = http.createServer((req, res) => {
    if ( req.method === "GET" && req.url === "/rooms" ) {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify(database.listRooms()));
        return;
    }

    if ( req.method === "GET" && req.url.startsWith("/room/") ) {
        const id = decodeURIComponent(req.url.slice("/room/".length));
        const room = database.getRoom(id);

        res.writeHead(room ? 200 : 404, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify(room ? { id: room.id, name: room.name, game: room.game } : { message: "not found" }));
        return;
    }

    res.writeHead(200);
    res.end();
});

server.listen(config.basePORT, config.baseIP, () => {
    console.log('Server listening on port ' + config.basePORT);
});

module.exports = server;