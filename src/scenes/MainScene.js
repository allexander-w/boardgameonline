import notificationsModule from "../modules/notifications";
import cameraModule from "../modules/camera";
import actionsModule from "../modules/actions";
import handsModule from "../modules/hand";
import tabsModule from "../modules/tabs";

class MainScene {
    constructor(layerManager, layers, preloader, moduleManager) {
        /* Менеджер слоев */
        this.layerManager = layerManager;
        this.moduleManager = moduleManager;

        /* Добавление кастомных слоев */
        this.customLayersInitialization(layers);

        /* Получение слоя */
        this.boardLayer = this.layerManager.getLayer('board');


        this.moduleManager.registerModule("notifications", notificationsModule);
        this.moduleManager.registerModule("actions", actionsModule);
        this.moduleManager.registerModule("hands", handsModule);
        this.moduleManager.registerModule("tabs", tabsModule);
    }

    customLayersInitialization(layers) {
        if ( layers?.length ) {
            for ( const l of layers ) {
                this.layerManager.registerLayer(l);
            }
        }
    }
}

export default MainScene;