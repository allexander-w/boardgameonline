import MainScene from "../../scenes/MainScene";
import {cardsManager, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import drawModule from "./modules/draw/index";
import cameraModule from "../../modules/camera";
import resourcesModule from "../../modules/resources";
import config from "../thiswarofmine/configs/resources.config";
import saverModule from "../../modules/saver";

class DiplomacyScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
    }

    initialization() {
        console.log("diplomacy is running...");

        const table = new FieldCard({ front: '/diplomacy/bg.png', bg: null }, {
            draggable: false,
            x: 0, y: 0,
            width: 1668, height: 1505,
            opacity: 1, id: "field"
        });

        cardsManager.createCard(table, "fixed");
        this.moduleManager.registerModule("saver", drawModule);


        this.initialized("Дипломатия загружена!");
    }
}

export default DiplomacyScene;