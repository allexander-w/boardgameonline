class UsersHandler {
    constructor(tabsManager, uiManager, emitter, layersManager) {
        this.emitter = emitter;

        this.emitter.on("api.register.disconnected", tabsManager.render.bind(tabsManager, "usersTab"));
        this.emitter.on("api.register.joined", tabsManager.render.bind(tabsManager, "usersTab"));
    }
}

export default UsersHandler;