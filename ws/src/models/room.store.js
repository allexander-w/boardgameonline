const Room = require("./room.model");

class RoomStore {
    constructor() {
        this.rooms = new Map();
    }

    get(roomId) {
        return this.rooms.get(roomId) || null;
    }

    getOrCreate(roomId) {
        let room = this.rooms.get(roomId);

        if ( !room ) {
            room = new Room(roomId);
            this.rooms.set(roomId, room);
        }

        return room;
    }

    delete(roomId) {
        this.rooms.delete(roomId);
    }
}

module.exports = RoomStore;