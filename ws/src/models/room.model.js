class Room {
    constructor(id) {
        this.id = id;
        this.users = [];
        this.syncUser = null;
        this.bank = null;
    }

    addUser(user) {
        this.users.push(user);

        if ( !this.syncUser ) {
            this.syncUser = user.id;
        }
    }

    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);

        if ( this.syncUser === userId ) {
            this.syncUser = this.users[0]?.id || null;
        }
    }

    getUser(userId) {
        return this.users.find(user => user.id === userId);
    }

    broadcast(action, payload, excludeUserId) {
        for ( const user of this.users ) {
            if ( user.id === excludeUserId ) continue;
            user.send(action, payload);
        }
    }

    get isEmpty() {
        return this.users.length === 0;
    }
}

module.exports = Room;