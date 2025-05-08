import { layersManager, moduleManager, cardsManager, ws } from "../../core";
import cameraModule from "../../modules/camera";
import handsModule from "../../modules/hand";
import notificationsModule from "../../modules/notifications";
import actionsModule from "../../modules/actions";
import tabsModule from "../../modules/tabs";
import usersModule from "../../modules/users";
import resourcesModule from "../../modules/resources";

import MainScene from "../../scenes/MainScene";
import FieldCard from "../../entities/FieldCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";

class PaleoScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen);
        this.moduleManager = moduleManager;

        this.initialization();
    }

    initialization() {
        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/paleo/fields/' + (index + 1) + '.png';
            const options =  { draggable: false, x: -400 + (index * 1890), y: 3720, width: 1679, height: 1455, opacity: 1, id: "field_" + (index + 1) };

            const card = new FieldCard({ front: src, bg: null }, options);
            cardsManager.createCard(card, "fixed");
        }

        const table = new FieldCard({ front: '/paleo/fields/5.png', bg: null }, {
            draggable: false,
            x: -400, y: 1720,
            width: 1394, height: 1820,
            opacity: 1, id: "field_4"
        });

        const death = new FieldCard({ front: '/paleo/fields/4.png', bg: null }, {
            draggable: false,
            x: 1394, y: 2020,
            width: 441 * 2, height: 600 * 2,
            opacity: 1, id: "field_5"
        });

        cardsManager.createCard(table, "fixed");
        cardsManager.createCard(death, "fixed");


        /* Рендер изобретений */
        for ( const [index, value] of new Array(13).entries() ) {
            const src = '/paleo/creations/' + (index + 1) + '.png';
            const options =  {  draggable: true, x: -1000 + (index * 250), y: 2850, width: 200, height: 200, opacity: 1 };

            for (let i = 0; i < 5; i++) {
                const card = new DuosideCard({ front: src, bg: src }, { id: "creations_" + index + "_" + i, ...options });
                cardsManager.createCard(card);
            }
        }

        const cards = [
            {folder: "1", count: 64, zero: true},
            {folder: "2", count: 40, zero: true},
            {folder: "3", count: 32, zero: true},
            {folder: "4", count: 16, zero: true},
            {folder: "5", count: 44, zero: true},
            {folder: "А", count: 18},
            {folder: "Б", count: 22},
            // {folder: "В", count: 20},
            // {folder: "Г", count: 22},
            // {folder: "Д", count: 24},
            // {folder: "Е", count: 34},
            // {folder: "Ж", count: 30},
            // {folder: "И", count: 28},
            // {folder: "К", count: 22},
            // {folder: "Л", count: 28},
            // {folder: "М", count: 36},
        ]


        /* Рендер основных карт */
        cards.forEach((config, i) => {
            const heapOptions = { x: -1000 + ( i * 430 ), y: 0, width: 331 + 20, height: 514 + 20 };

            let number = 1;
            for ( const [index, value] of new Array(config.count).entries() ) {
                if ( !((index + 1) % 2) ) continue;

                const id = config.folder + '_' + index;
                const elementPosition = { x: heapOptions.x + heapOptions.width / 2, y: heapOptions.y + heapOptions.height / 2  };
                const src = `/paleo/${ config.folder }/${ config.zero ? '0' : '' }${config.folder} (${ number }).jpg`;
                const bgSrc = `/paleo/${ config.folder }/${ config.zero ? '0' : '' }${config.folder} (${ number })-2.jpg`;

                const options =  { draggable: true, id, ...elementPosition, width: 331, height: 514, opacity: 1 };

                const card = new DuosideCard({ front: src, bg: bgSrc }, options);
                cardsManager.createCard(card);

                number ++;
            }
        })

        /* Рендер костей */
        const dice = new DiceCard({ front: '/paleo/dice/1.png' }, { id: "dice1" });
        cardsManager.createCard(dice);

        this.moduleManager.registerModule("notifications", notificationsModule);
        this.moduleManager.registerModule("camera", cameraModule);
        this.moduleManager.registerModule("actions", actionsModule);
        this.moduleManager.registerModule("hands", handsModule);
        this.moduleManager.registerModule("tabs", tabsModule);
        this.moduleManager.registerModule("users", usersModule);
        this.moduleManager.registerModule("resources", resourcesModule);

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify("Paleo полностью загружено!");

        ws.connect();
    }
}

export default PaleoScene;
