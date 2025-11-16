// import GeneralScene from "../../scenes/general";
// import Camera from "../../core/camera";
// import FlashpointHeaps from "./entities/heaps";
// import heapsConfig from "./config/index";
//
//
// function FlashpointScene() {
//     GeneralScene.apply(this, [...arguments, { dice: true }]);
//
//     /* Загрузка игрового поля */
//     this.loadGameField("/entities/field.png", { width: 2308, height: 1632 })
//         .then(() => new Camera(this.board));
//
//     /* Иинициализация всех куч элементов */
//     new FlashpointHeaps(this.board, heapsConfig);
//
//     this.initialize();
// }
//
// export default FlashpointScene;


import MainScene from "../../scenes/MainScene";
import {cardsManager, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import cameraModule from "../../modules/camera";
import resourcesModule from "../../modules/resources";
import config from "../viticulture/config/resources.config";
import saverModule from "../../modules/saver";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";

class FlashpointScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
    }

    initialization() {
        const table = new FieldCard({ front: '/flashpoint/field.png', bg: null }, {
            draggable: false,
            x: 0, y: 0,
            width: 2308, height: 1632,
            opacity: 0.6, id: "field"
        });

        cardsManager.createCard(table, "fixed");

        for ( const [index, value] of new Array(18).entries() ) {
            const src = '/flashpoint/persons/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2346 + (index + 1), y: 0 + (index + 1), width: 95, height: 95, opacity: 1, id: "persons_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/flashpoint/persons/bg.png' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(24).entries() ) {
            const src = '/flashpoint/burnout/burn.png';
            const options =  { draggable: true, x: 2545 + (index + 1), y: 0 + (index + 1), width: 60, height: 60, opacity: 1, id: "burnout_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: null }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(21).entries() ) {
            const src = '/flashpoint/run/run.png';
            const options =  { draggable: true, x: 2709 + (index + 1), y: 0 + (index + 1), width: 60, height: 60, opacity: 1, id: "run_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: null }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(6).entries() ) {
            const src = '/flashpoint/warn/warn.png';
            const options =  { draggable: true, x: 2346 + (index + 1), y: 175 + (index + 1), width: 75, height: 75, opacity: 1, id: "warn_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: null }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/flashpoint/medicine/medicine.png';
            const options =  { draggable: true, x: 2525 + (index + 1), y: 175 + (index + 1), width: 75, height: 75, opacity: 1, id: "medicine_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: null }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(2).entries() ) {
            const src = '/flashpoint/machines/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2346 + (index + 1), y: 330 + (index + 1), width: 253, height: 151, opacity: 1, id: "machines_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/flashpoint/machines/bg.png' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(4).entries() ) {
            const src = '/flashpoint/hero_chip/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2703 + (index + 1), y: 330 + (index + 1), width: 90, height: 90, opacity: 1, id: "hero_chip_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: src }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(8).entries() ) {
            const src = '/flashpoint/hero/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 1446 + (index + 1), y: 540 + (index + 1), width: 303, height: 452, opacity: 1, id: "hero_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/flashpoint/hero/bg.png' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(4).entries() ) {
            const src = '/flashpoint/color/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2753 + (index + 1), y: 540 + (index + 1), width: 303, height: 221, opacity: 1, id: "color_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: src }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(24).entries() ) {
            const src = '/flashpoint/fault/fault.png';
            const options =  { draggable: true, x: 2704 + (index + 1), y: 175 + (index + 1), width: 40, height: 40, opacity: 1, cornerRadius: 0, id: "fault_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: src }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(33).entries() ) {
            const src = '/flashpoint/fire/1.png';
            const options =  { draggable: true, x: 2346 + (index + 1), y: 1072 + (index + 1), width: 140, height: 140, opacity: 1, id: "fire_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/flashpoint/fire/bg.png' }, options);
            cardsManager.createCard(card);
        }

        for ( const [index, value] of new Array(33).entries() ) {
            const src = '/flashpoint/doors/1.png';
            const options =  { draggable: true, x: 2590 + (index + 1), y: 1072 + (index + 1), width: 75, height: 75, opacity: 1, id: "doors_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/flashpoint/doors/bg.png' }, options);
            cardsManager.createCard(card);
        }


        const d8 = new DiceCard({ front: '/dice/d8.png' }, { x: 2090, y: 140, id: "dice4", sides: 8 });
        cardsManager.createCard(d8);

        const d6 = new DiceCard({ front: '/dice/dice-sprite.png' }, { x: 2090, y: 140, id: "dice4", sides: 6 });
        cardsManager.createCard(d6);



        this.moduleManager.registerModule("camera", cameraModule);
        // this.moduleManager.registerModule("resources", resourcesModule, config);
        this.moduleManager.registerModule("saver", saverModule);

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify("Flashpoint полностью загружено!");

        ws.connect();

    }

}

export default FlashpointScene;