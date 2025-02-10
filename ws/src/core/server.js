const http = require("http");
const config = require("../../config");

const server = http.createServer((req, res) => {
    res.writeHead(200);
});

server.listen(config.basePORT, config.baseIP, () => {
    console.log('Server listening on port ' + config.basePORT);
});

module.exports = server;