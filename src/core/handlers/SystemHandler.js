class SystemHandler {
    constructor(emitter, sender, userManager, cursorsManager) {
        this.emmiter = emitter;
        this.sender = sender;
        this.userManager = userManager;
        this.cursorsManager = cursorsManager;

        this.emmiter.on("system.websockets.onopen", () => {
            console.log("ws opened");
            this.sender.send("api.register.connected", this.userManager.user);
        })

        this.emmiter.on("system.websockets.onclose", () => {
            console.log("ws closed", e);
        })
    }
}

export default SystemHandler;