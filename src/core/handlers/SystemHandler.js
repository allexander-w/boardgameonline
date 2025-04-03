class SystemHandler {
    constructor(emitter, sender, userManager, cursorsManager, moduleManager) {
        this.emmiter = emitter;
        this.sender = sender;
        this.userManager = userManager;
        this.cursorsManager = cursorsManager;
        this.moduleManager = moduleManager;

        this.emmiter.on("system.websockets.onopen", () => {
            const notificationsManager = this.moduleManager.getModule("notifications");
            notificationsManager.notify("Вебсокеты открыты");

            this.sender.send("api.register.connected", this.userManager.user);
        })

        this.emmiter.on("system.websockets.onclose", () => {
            const notificationsManager = this.moduleManager.getModule("notifications");
            notificationsManager.notify("Соединение прервано...");

            console.log("ws closed", e);
        })
    }
}

export default SystemHandler;