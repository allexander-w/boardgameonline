const {serialize} = require("../utils/serialize.util");

class User {
    constructor(id, connection) {
        this.id = id;
        this.hidden = new Set();
        this.name = "";
        this.avatar = "";
        this.role = "player";

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

    setRole(role) {
        this.role = role;
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