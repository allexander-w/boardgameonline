class RegisterHandler {
    constructor(emitter, sender, usersManager, cursorsManager, moduleManager) {
        this.emmiter = emitter;
        this.sender = sender;
        this.usersManager = usersManager;
        this.cursorsManager = cursorsManager;
        this.moduleManager = moduleManager;

        this.emmiter.on("api.register.connected", this.connected.bind(this));
        this.emmiter.on("api.register.disconnect", this.disconnect.bind(this));
        this.emmiter.on("api.register.join", this.join.bind(this));
        this.emmiter.on("api.room.hostChanged", this.hostChanged.bind(this));
        this.emmiter.on("api.room.kicked", this.kicked.bind(this));
        this.emmiter.on("api.room.rejected", this.rejected.bind(this));
    }


    connected(data) {
        const notificationsManager = this.moduleManager.getModule("notifications");
        notificationsManager.notify("Вы подключены к игре!");

        this.usersManager.user.id = data.user.id;
        this.usersManager.user.role = data.user.role;
        this.sender.executeStack();
    }

    disconnect(data) {
        const notificationsManager = this.moduleManager.getModule("notifications");
        notificationsManager.notify("Пользователь " + data?.name + " отсоединился...");

        this.usersManager.deleteUser(data.id);
        this.emmiter.emit("api.register.disconnected");
    }

    join(data) {
        console.log(data);

        this.usersManager.setSyncPoint(data.syncUser);

        if ( this.usersManager.user.id !== data.user.id ) {
            const notificationsManager = this.moduleManager.getModule("notifications");
            notificationsManager.notify("Пользователь " + data.user.name + " подключился к игре!");
        }

        for (const user of data.users) {
            if ( this.usersManager.users.has(user.id) || this.usersManager.user.id === user.id ) continue;
            this.usersManager.users.set(user.id, {});
        }

        for (const [id, user] of this.usersManager.users) {
            if ( user.cursor?.cursor?.attrs ) continue;
            this.cursorsManager.create({ id, user: data.users.find(u => u.id === id) });
        }

        this.sender.send("api.register.joined");
    }

    hostChanged(data) {
        this.usersManager.setSyncPoint(data.syncUser);
        this.usersManager.user.role = this.usersManager.user.id === data.syncUser ? "host" : "player";

        for ( const user of data.users ) {
            const known = this.usersManager.getUser(user.id);
            if ( known ) known.role = user.role;
        }

        const notificationsManager = this.moduleManager.getModule("notifications");
        notificationsManager.notify("Хост комнаты изменился");

        this.emmiter.emit("api.register.roleChanged");
    }

    kicked() {
        const notificationsManager = this.moduleManager.getModule("notifications");
        notificationsManager.notify("Вас удалили из комнаты");
    }

    rejected(data) {
        console.warn("Действие отклонено сервером:", data?.action);
    }
}

export default RegisterHandler;