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
        this.removeListeners();

        const grid = this.uiManager.getWrapper();
        if (!grid) return;

        this.input = grid.previousElementSibling.children[0];
        this.grid = grid;

        this.input.addEventListener("keyup", this.bindedSearchHandler);
        this.grid.addEventListener("click", this.bindedSelectHandler);
    }

    removeListeners() {
        this.input?.removeEventListener("keyup", this.bindedSearchHandler);
        this.grid?.removeEventListener("click", this.bindedSelectHandler);
        this.input = this.grid = null;
    }
}

export default ResourcesHandler;