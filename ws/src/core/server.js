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

    res.writeHead(200);
    res.end();
});

server.listen(config.basePORT, config.baseIP, () => {
    console.log('Server listening on port ' + config.basePORT);
});

module.exports = server;