import Konva from "konva";

import MainScene from "../../scenes/MainScene";
import {cardsManager, emitter, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import saverModule from "../../modules/saver";
import StateCard from "../thiswarofmine/entities/state/StateCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";


class SolitairScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager, cardsManager);
        this.moduleManager = moduleManager;
        this.boardLayer = layersManager.getLayer("board");

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Карты успешно загружено"));
    }

    initialization() {

        for ( const [index, value] of new Array(49).entries() ) {
            const src = '/solitair/cards/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 0, y: 0, width: 652, height: 993, opacity: 1, id: "card_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/solitair/cards/bg.png' }, options);
            cardsManager.createCard(card);
        }

    }
}

export default SolitairScene;