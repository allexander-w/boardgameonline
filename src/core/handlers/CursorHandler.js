class CursorHandler {
    constructor(emitter, usersManager, cursorsManager) {
        this.emitter = emitter;
        this.usersManager = usersManager;
        this.cursorsManager = cursorsManager;

        this.emitter.on("api.cursors.move", this.cursorsManager.remoteMove);
    }
}

export default CursorHandler;