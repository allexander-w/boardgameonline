const {serialize} = require("../utils/serialize.util");

class User {
    constructor(id, connection) {
        this.id = id;

        Object.defineProperty(this, 'connection', {
            value: connection,
            configurable: false,
            writable: false,
            enumerable: false,
        });
    }

    get connected() {
        return this.connection.connected;
    }

    send(action, payload) {
        this.connection.send(serialize({
            action, payload
        }))
    }
}

module.exports = User;