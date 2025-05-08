class SaverHandler {
    constructor(uiManager, saverManager, emitter) {
        this.isRegistered = false;
        this.uiManager = uiManager;
        this.saverManager = saverManager;
        this.bindeMenuHandler = this.menuHandler.bind(this);
        this.emitter = emitter;

        this.emitter.on("modules.tabs.prerender", (id) => {
            if ( id !== "saverTab" ) this.removeListeners();
        })

        this.emitter.on("modules.tabs.rendered", (id) => {
            if ( id === "saverTab" ) this.registerListeners();
        })

    }

    menuHandler(e) {
        const target = e.target.closest(".save-button");
        if (!target) return false;

        const event = target.dataset.event;
        if ( this.saverManager[event] ) this.saverManager[event]();
    }


    registerListeners() {
        if ( this.isRegistered ) return false;

        const menuTemplate = this.uiManager.getWrapper();
        menuTemplate.addEventListener("click", this.bindeMenuHandler);

        this.isRegistered = true;
    }

    removeListeners() {
        const menuTemplate = this.uiManager.getWrapper();

        if ( menuTemplate ) {
            menuTemplate.removeEventListener("click", this.bindeMenuHandler);
        }

        this.isRegistered = false;
    }
}

export default SaverHandler;