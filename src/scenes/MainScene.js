import notificationsModule from "../modules/notifications";
import cameraModule from "../modules/camera";
import actionsModule from "../modules/actions";
import handsModule from "../modules/hand";
import usersModule from "../modules/users";
import tabsModule from "../modules/tabs";
import resourcesModule from "../modules/resources";
import saverModule from "../modules/saver";
import Konva from "konva";
import {ws} from "../core";
import createPattern from "../utils/patterns/grid";

class MainScene {
    constructor(layerManager, layers, preloader, moduleManager, cardsManager) {
        /* Менеджер слоев */
        this.layerManager = layerManager;
        this.moduleManager = moduleManager;
        this.cardsManager = cardsManager;

        /* Добавление кастомных слоев */
        this.customLayersInitialization(layers);

        /* Получение слоя */
        this.boardLayer = this.layerManager.getLayer('board');


        this.moduleManager.registerModule("tabs", tabsModule);
        this.moduleManager.registerModule("notifications", notificationsModule);
        this.moduleManager.registerModule("actions", actionsModule);
        this.moduleManager.registerModule("hands", handsModule);
        this.moduleManager.registerModule("users", usersModule)
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

        this.layerManager.cacheAllGroups();

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify(msg);

        ws.connect();
    }
}

export default MainScene;