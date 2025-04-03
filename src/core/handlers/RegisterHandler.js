class RegisterHandler {
    constructor(emitter, sender, usersManager, cursorsManager, moduleManager) {
        this.emmiter = emitter;
        this.sender = sender;
        this.usersManager = usersManager;
        this.cursorsManager = cursorsManager;
        this.moduleManager = moduleManager;

        this.emmiter.on("api.register.connected", this.connected.bind(this));
        this.emmiter.on("api.register.join", this.join.bind(this));
    }


    connected(data) {
        const notificationsManager = this.moduleManager.getModule("notifications");
        notificationsManager.notify("Вы подключены к игре!");

        this.usersManager.user.id = data.user.id;
        this.sender.executeStack();
    }

    join(data) {
        if ( this.usersManager.user.id !== data.user.id ) {
            const notificationsManager = this.moduleManager.getModule("notifications");
            notificationsManager.notify("Пользователь " + data.user.name + " подключился к игре!");
        }

        for (const user of data.users) {
            if ( this.usersManager.users.has(user.id) || this.usersManager.user.id === user.id ) continue;
            this.usersManager.users.set(user.id, {});
        }

        for (const [id, cursor] of this.usersManager.users) {
            if ( cursor?.attrs ) continue;
            this.cursorsManager.create({ id, user: data.users.find(u => u.id === id) });
        }
    }
}

export default RegisterHandler;