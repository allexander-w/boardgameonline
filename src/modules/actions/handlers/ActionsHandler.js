
class ActionsHandler {
    constructor(actionsManager, layersManager, moduleManager) {
        this.boardLayer = layersManager.getLayer("board");
        this.moduleManager = moduleManager;
        this.actionsManager = actionsManager;
        this.boardLayer.on("click", this.actionsManager.select.bind(this.actionsManager));

        document.querySelector("#actions").addEventListener("click", (e) => {
            const group = e.target.closest(".group-item");
            if ( group ) {
                const handModule = this.moduleManager.getModule("hands");
                handModule[group.dataset.type]();

                return false;
            }

            const element = e.target.closest(".action-menu-item");
            if ( element ) {
                this.actionsManager.selected.cardManager[element.dataset.type]();
            }
        })
    }
}

export default ActionsHandler;