class UsersManager {
    constructor() {
        this.user = {
            id: null,
            name: "",
            avatar: "",
        }

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

    deleteUser(id) {
        this.users.delete(id);
    }
}

export default UsersManager;