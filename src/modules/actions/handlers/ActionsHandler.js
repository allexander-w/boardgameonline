
class ActionsHandler {
    constructor(actionsManager, layersManager, moduleManager) {
        this.boardLayer = layersManager.getLayer("board");
        this.moduleManager = moduleManager;
        this.actionsManager = actionsManager;
        this.boardLayer.on("click tap", this.actionsManager.select.bind(this.actionsManager));

        document.querySelector(".tool-tray-cards").addEventListener("click", (e) => {
            const group = e.target.closest(".group-item");
            if ( group ) {
                if ( !group.dataset.type ) return false;
                const handModule = this.moduleManager.getModule("hands");
                handModule[group.dataset.type]();

                return false;
            }

            const element = e.target.closest(".action-tool");
            if ( element ) {
                this.actionsManager.selected.cardManager[element.dataset.type]();
            }
        })
    }
}

export default ActionsHandler;