const Room = require("./room.model");
const database = require("../storage/database");

class RoomStore {
    constructor() {
        this.rooms = new Map();
    }

    get(roomId) {
        return this.rooms.get(roomId) || null;
    }

    getOrCreate(roomId, requestedGame) {
        let room = this.rooms.get(roomId);
        if ( room ) return room;

        const saved = database.getRoom(roomId);

        room = new Room(roomId, saved?.name, saved?.game || requestedGame);
        if ( saved ) room.checkpoint(saved.state);
        else database.createRoom(roomId, roomId, room.game);

        this.rooms.set(roomId, room);
        return room;
    }

    persistAndEvict(room) {
        database.saveRoom(room.id, room.name, room.game, room.getPersistableState());
        this.rooms.delete(room.id);
    }
}

module.exports = RoomStore;