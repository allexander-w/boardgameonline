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
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "ResArcana успешно загружено"));
    }

    initialization() {

        const addCustomCard = (src, bg, opts) => {
            const options =  { x: 0, y: 0, draggable: true, width: 90, height: 90, cornerRadius: 5, ...opts };
            const card = new DuosideCard({ front:src, bg: bg || src }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(36).entries() ) {
            const src = '/resarcana/artefacts/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 0, y: 0, width: 741, height: 1050, opacity: 1, id: "artefact_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/resarcana/artefacts/bg.png' }, options);
            cardsManager.createCard(card);
        }


        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/resarcana/mags/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 900, y: 0, width: 741, height: 1050, opacity: 1, id: "mag_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/resarcana/mags/bg.png' }, options);
            cardsManager.createCard(card);
        }


        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/resarcana/monuments/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 1800, y: 0, width: 741, height: 1050, opacity: 1, id: "monument_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/resarcana/monuments/bg.png' }, options);
            cardsManager.createCard(card);
        }


        for ( const [index, value] of new Array(8).entries() ) {
            const src = '/resarcana/magicthings/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 0, y: 1100, width: 492, height: 752, opacity: 1, id: "magicthing_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/resarcana/magicthings/bg.png' }, options);
            cardsManager.createCard(card);
        }

        addCustomCard('/resarcana/gamechip/1.png', '/resarcana/gamechip/bg.png', { x: 1000, y: -1300, width: 880, height: 880 });


        for ( const [index, value] of new Array(10).entries() ) {
            if ( !((index + 1) % 2) ) continue;

            const src = '/resarcana/powercard/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 3000, y: 0, width: 918, height: 1322, opacity: 1, id: "powercard_" + (index + 1) };
            const card = new DuosideCard({ front: src, bg: '/resarcana/powercard/' + (index + 2) + '.png' }, options);
            cardsManager.createCard(card);
        }

        this.moduleManager.registerModule("resources", resourcesModule, config);
    }
}

export default MarsScene;