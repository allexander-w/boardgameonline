class UsersManager {
    constructor() {
        this.user = {
            id: null,
            name: "",
            avatar: "",
            room: "",
            role: "player",
        }

        this.syncPoint = null;
        this.users = new Map();
        this.handCounts = {};
    }

    setHandCounts(counts) {
        this.handCounts = counts || {};
    }

    register(user) {
        this.user = { ...this.user, ...user };
    }

    getUser(id) {
        return this.users.get(id);
    }

    setUser(id, user) {
        return this.users.set(id, user);
    }

    setSyncPoint(id) {
        this.syncPoint = id;
    }

    deleteUser(id) {
        const deletedUser = this.getUser(id);
        deletedUser.cursor.destroy();

        this.users.delete(id);
    }
}

export default UsersManager;