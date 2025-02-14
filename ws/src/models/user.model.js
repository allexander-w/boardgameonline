const {serialize} = require("../utils/serialize.util");

class User {
    constructor(id, connection) {
        this.id = id;
        this.hidden = new Set();
        this.name = "";

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

    get hiddens() {
        return Array.from(this.hidden);
    }

    setName(name) {
        this.name = name;
    }

    send(action, payload) {
        this.connection.send(serialize({
            action, payload
        }))
    }

    hide(id) {
        this.hidden.add(id);
    }

    show(id) {
        this.hidden.delete(id);
    }


    toJSON() {
        return {
            ...this,
            hidden: this.hiddens
        };
    }
}

module.exports = User;