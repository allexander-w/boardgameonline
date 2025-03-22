import { layersManager, moduleManager, usersManager, cardsManager, ws } from "../../core";
import cameraModule from "../../modules/camera";

import MainScene from "../../scenes/MainScene";
import FieldCard from "../../entities/FieldCard";

class PaleoScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, [], preloadScreen);
        this.moduleManager = moduleManager;

        this.initialization();
    }

    initialization() {
        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/paleo/fields/' + (index + 1) + '.png';
            const options =  { draggable: false, x: -400 + (index * 1890), y: 3720, width: 1679, height: 1455, opacity: 1 };

            const card = new FieldCard({ front: src, bg: null }, options);
            cardsManager.createCard(card);
        }

        this.moduleManager.registerModule("camera", cameraModule);
    }
}

export default PaleoScene;
