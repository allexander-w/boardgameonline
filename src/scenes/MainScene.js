import notificationsModule from "../modules/notifications";
import cameraModule from "../modules/camera";
import actionsModule from "../modules/actions";
import handsModule from "../modules/hand";
import tabsModule from "../modules/tabs";
import resourcesModule from "../modules/resources";
import saverModule from "../modules/saver";
import {ws} from "../core";

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

    initialized(msg) {
        this.moduleManager.registerModule("camera", cameraModule);
        this.moduleManager.registerModule("saver", saverModule);

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify(msg);

        ws.connect();
    }
}

export default MainScene;