import {emitter, cardsManager} from "../../../core";

class ActionsHandler {
    constructor(actionsManager, layersManager, moduleManager) {
        this.boardLayer = layersManager.getLayer("board");
        this.moduleManager = moduleManager;
        this.actionsManager = actionsManager;

        this.boardLayer.on("click tap", (el) => {
            const handModule = this.moduleManager.getModule("hands");
            handModule.select(el.target);
        });

        const tray = document.querySelector(".tool-tray-cards");

        /* Панель следит за выбором стопки и лимитом n */
        emitter.on("stack.selection.changed", ({ total, limit }) => {
            if ( total > 1 ) this.actionsManager.selectStack(total, limit);
            else this.actionsManager.selectCouple(0);
        });

        /* Колесико над счетчиком в панели тоже меняет n */
        tray.addEventListener("wheel", (e) => {
            if ( !e.target.closest(".stack-limit") ) return;
            e.preventDefault();
            cardsManager.adjustStackLimit(e.deltaY < 0 ? 1 : -1);
        }, { passive: false });

        tray.addEventListener("click", (e) => {
            const group = e.target.closest(".group-item");
            if ( group ) {
                if ( !group.dataset.type ) return false;
                const handModule = this.moduleManager.getModule("hands");
                handModule[group.dataset.type]();

                return false;
            }

            const element = e.target.closest(".action-tool");
            if ( element ) {
                this.actionsManager.cardsManager.dispatchAction(this.actionsManager.selected.cardManager, element.dataset.type);
            }
        })
    }
}

export default ActionsHandler;