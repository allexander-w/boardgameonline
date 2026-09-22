class UsersManager {
    constructor() {
        this.user = {
            id: null,
            name: "",
            avatar: "",
            room: "",
        }

        this.syncPoint = null;
        this.users = new Map();
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