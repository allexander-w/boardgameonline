import Konva from "konva";

import MainScene from "../../scenes/MainScene";
import {cardsManager, emitter, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import resourcesModule from "../../modules/resources";
import config from "./config/resources.config";
import saverModule from "../../modules/saver";
import StateCard from "../thiswarofmine/entities/state/StateCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";


class IkiScene extends MainScene {
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

        const table = new FieldCard({ front: '/iki/field.png', bg: null }, {
            draggable: false,
            x: 0, y: 0,
            width: 3216, height: 2916,
            opacity: 0.8, id: "field"
        });
        cardsManager.createCard(table, "fixed");


        const d4 = new DiceCard({ front: '/iki/fire/d4.png' }, { x: 0, y: -1500, id: "dice4", sides: 4 });
        cardsManager.createCard(d4);

        const stepsDice = new DiceCard({ front: '/iki/rand/d4.png' }, { x: 0, y: -1500, id: "dice5", sides: 4 });
        cardsManager.createCard(stepsDice);


        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/iki/build/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: 0, y: -2000, width: 458, height: 704, opacity: 1, id: "build_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/iki/build/bg.png' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(14).entries() ) {
            const src = '/iki/pink/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: -3000, y: -2000, width: 455, height: 694, opacity: 1, id: "pink_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/iki/pink/bg.png' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(14).entries() ) {
            const src = '/iki/green/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: -2400, y: -2000, width: 455, height: 694, opacity: 1, id: "green_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/iki/green/bg.webp' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(14).entries() ) {
            const src = '/iki/orange/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: -1800, y: -2000, width: 455, height: 694, opacity: 1, id: "orange_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/iki/orange/bg.webp' }, options);
            cardsManager.createCard(card);
        }


        for ( const [index, value] of new Array(14).entries() ) {
            const src = '/iki/blue/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: -1200, y: -2000, width: 455, height: 694, opacity: 1, id: "blue_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/iki/blue/bg.webp' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(4).entries() ) {
            const src = '/iki/pane/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 0, y: 2500, width: 3264, height: 477, opacity: 1, id: "pane_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: src }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(4).entries() ) {
            const src = '/iki/depart/' + (index + 1) + '.webp';
            const options =  { draggable: true, x: 600, y: -2000, width: 454, height: 703, opacity: 1, id: "depart_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg:  '/iki/depart/bg.png' }, options);
            cardsManager.createCard(card);
        }

        const colors = ["pink", "green", "orange", "blue"];

        colors.forEach((color, index) => {
            for ( const [i, value] of new Array(2).entries() ) {
                const src = `/iki/pipe/${color}/` + (i + 1) + '.png';
                const options =  { draggable: true, x: -1800 + (index * 810), y: -1250, width: 220, height: 220, opacity: 1, id: color + "_pipe_" + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/iki/pipe/${color}/bg.png` }, options);
                cardsManager.createCard(card);
            }

            for ( const [i, value] of new Array(2).entries() ) {
                const src = `/iki/tabacco/${color}/` + (i + 1) + '.png';
                const options =  { draggable: true, x: -1800 + (index * 810), y: -1250, width: 220, height: 220, opacity: 1, id: color + "_tabacco_" + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/iki/tabacco/${color}/bg.png` }, options);
                cardsManager.createCard(card);
            }

            for ( const [i, value] of new Array(2).entries() ) {
                const src = `/iki/fish/${color}/` + (i + 1) + '.png';
                const options =  { draggable: true, x: -1800 + (index * 810), y: -1250, width: 220, height: 220, opacity: 1, id: color + "_fish_" + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/iki/fish/${color}/bg.png` }, options);
                cardsManager.createCard(card);
            }
        })

        this.moduleManager.registerModule("resources", resourcesModule, config);
    }
}

export default IkiScene;