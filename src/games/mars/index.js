import Konva from "konva";

import MainScene from "../../scenes/MainScene";
import {cardsManager, emitter, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import resourcesModule from "../../modules/resources";
import config from "./config/resources.config";
import saverModule from "../../modules/saver";
import StateCard from "../thiswarofmine/entities/state/StateCard";
import DuosideCard from "../../entities/duoside/DuosideCard";


class MarsScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager, cardsManager);
        this.moduleManager = moduleManager;
        this.boardLayer = layersManager.getLayer("board");

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Покорение марса успешно загружено"));
    }

    initialization() {
        const table = new FieldCard({ front: '/mars/field.webp', bg: null }, {
            draggable: false,
            x: 1380, y: 1020,
            width: 1920, height: 1624,
            opacity: 0.8, id: "field"
        });
        cardsManager.createCard(table, "fixed");

        layersManager.registerGroup("cards", this.boardLayer, { x: 0, y: 0 });
        const cardsGroup = layersManager.getGroup("cards");

        for ( const [index, value] of new Array(208).entries() ) {
            const src = '/mars/cards_o/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: 0, y: 0, width: 248, height: 350, opacity: 1, id: "card_" + (index + 1), isCaching: true };

            const card = new DuosideCard({ front: src, bg: '/mars/cards_o/bg.webp' }, options);
            cardsManager.registerCard(card);
            cardsGroup.add(card.element);
        }

        for ( const [index, value] of new Array(2).entries() ) {
            const src = '/mars/pane/1.png';
            const options =  { draggable: true, x: 0, y: 3000, width: 2598/3, height: 1888/3, opacity: 1, id: "pane_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: src }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(2).entries() ) {
            const src = '/mars/begin_corp/1.webp';
            const options =  { draggable: true, x: 1200, y: 0, width: 350, height: 248, opacity: 1, id: "begin_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/mars/begin_corp/bg.webp' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(12).entries() ) {
            const src = '/mars/corp/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: 600, y: 0, width: 350, height: 248, opacity: 1, id: "corp" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/mars/corp/bg.webp' }, options);
            cardsManager.createCard(card);
        }

        this.moduleManager.registerModule("resources", resourcesModule, config);
    }
}

export default MarsScene;