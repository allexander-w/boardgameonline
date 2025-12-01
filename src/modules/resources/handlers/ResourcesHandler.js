class ResourcesHandler {
    constructor(resourcesManager, uiManager, emitter, layersManager) {
        this.resourcesManager = resourcesManager;
        this.uiManager = uiManager;

        this.emitter = emitter;
        this.isRegistered = false;

        this.layersManager = layersManager;
        const board = layersManager.stage;

        this.bindedSearchHandler = this.searchHandler.bind(this);
        this.bindedSelectHandler = this.selectHandler.bind(this);

        this.emitter.on("modules.tabs.prerender", (id) => {
            if ( id !== "resourcesTab" ) this.removeListeners();
        })

        this.emitter.on("modules.tabs.rendered", (id) => {
            if ( id === "resourcesTab" ) this.registerListeners();
        })

        board.on("click", this.putHandler.bind(this));

        this.emitter.on("modules.resources.put", this.resourcesManager.remotePut.bind(this.resourcesManager));
    }

    putHandler(e) {
        if ( e.evt.altKey ) {
            const board = this.layersManager.getLayer("board");
            const pos = board.getRelativePointerPosition();

            this.resourcesManager.put(pos);
        }
    }

    selectHandler(e) {
        const parent = e.target.closest(".resource-card");
        if ( parent ) {
            this.resourcesManager.select(parent.dataset.id);
        }
    }

    searchHandler(e) {
        this.resourcesManager.search(e.target.value);
    }

    registerListeners() {
        if ( this.isRegistered ) return false;

        const resourcesTemplate = this.uiManager.getWrapper();
        const input = resourcesTemplate.previousElementSibling.children[0];

        input.addEventListener("keyup", this.bindedSearchHandler);
        resourcesTemplate.addEventListener("click", this.bindedSelectHandler);

        this.isRegistered = true;
    }

    removeListeners() {
        const resourcesTemplate = this.uiManager.getWrapper();

        if ( resourcesTemplate ) {
            const input = resourcesTemplate.previousElementSibling.children[0];

            input.removeEventListener("keyup", this.bindedSearchHandler);
            resourcesTemplate.removeEventListener("click", this.bindedSelectHandler);
        }

        this.isRegistered = false;
    }
}

export default ResourcesHandler;