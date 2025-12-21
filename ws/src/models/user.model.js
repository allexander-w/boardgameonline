const {serialize} = require("../utils/serialize.util");

class User {
    constructor(id, connection) {
        this.id = id;
        this.hidden = new Set();
        this.name = "";
        this.avatar = ""

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

    setName(name) {
        this.name = name;
    }

    setAvatar(ava) {
        this.avatar = ava;
    }

    send(action, payload) {
        this.connection.send(serialize({
            action, payload
        }))
    }

    toJSON() {
        return {
            ...this,
        };
    }
}

module.exports = User;