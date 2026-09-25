class Room {
    constructor(id, name, game) {
        this.id = id;
        this.name = name || id;
        this.game = game || null;
        this.users = [];
        this.syncUser = null;
        this.bank = null;
        this.hands = new Map();
        this.state = { elements: [], resources: [] };
        this.releaseCount = 0;
    }

    checkpoint(payload) {
        this.state = {
            elements: payload.elements || [],
            resources: payload.resources || [],
        };
    }

    hasState() {
        return this.state.elements.length > 0 || this.state.resources.length > 0;
    }

    getSyncPayload() {
        return { ...this.state, hands: this.getHandIds() };
    }

    getPersistableState() {
        return { ...this.state };
    }

    addUser(user) {
        this.users.push(user);

        if ( !this.syncUser ) {
            this.syncUser = user.id;
        }

        this.refreshRoles();
    }

    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);

        if ( this.syncUser === userId ) {
            this.syncUser = this.users[0]?.id || null;
        }

        this.refreshRoles();
    }

    refreshRoles() {
        for ( const user of this.users ) {
            user.setRole(user.id === this.syncUser ? "host" : "player");
        }
    }

    getUser(userId) {
        return this.users.find(user => user.id === userId);
    }

    takeToHand(cardId, ownerId) {
        this.hands.set(cardId, ownerId);
    }

    releaseFromHand(cardId) {
        this.hands.delete(cardId);
    }

    getHandIds() {
        return Array.from(this.hands.keys());
    }

    getHandCounts() {
        const counts = {};

        for ( const ownerId of this.hands.values() ) {
            counts[ownerId] = (counts[ownerId] || 0) + 1;
        }

        return counts;
    }

    releaseUserHands(userId) {
        const released = [];

        for ( const [cardId, ownerId] of this.hands.entries() ) {
            if ( ownerId !== userId ) continue;
            released.push(cardId);
            this.hands.delete(cardId);
        }

        return released;
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