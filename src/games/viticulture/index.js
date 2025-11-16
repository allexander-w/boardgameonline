import MainScene from "../../scenes/MainScene";
import {cardsManager, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import cameraModule from "../../modules/camera";
import resourcesModule from "../../modules/resources";
import config from "./config/resources.config";
import saverModule from "../../modules/saver";
import StateCard from "../thiswarofmine/entities/state/StateCard";
import DuosideCard from "../../entities/duoside/DuosideCard";

class ViticultureScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
    }

    initialization() {
        const table = new FieldCard({ front: '/viticulture/field.jpg', bg: null }, {
            draggable: false,
            x: 1380, y: 1020,
            width: 3012, height: 2422,
            opacity: 0.8, id: "field"
        });

        cardsManager.createCard(table, "fixed");



        /* ПОЛЯ */
        for ( const [index, value] of new Array(4).entries() ) {
            const src = '/viticulture/fields/' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1320 + (index * 1890), y: 3000, width: 1123, height: 794, opacity: 1, id: "field_" + (index + 1) };

            const card = new StateCard([src], options);
            cardsManager.createCard(card);
        }
        /* ПОЛЯ */


        /* КАРТОЧКИ ПРОДАНО */
        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/viticulture/plot/' + (index + 1) + '/1.png';
            const bgSrc = '/viticulture/plot/' + (index + 1) + '/bg.png';
            const options =  { draggable: true, x: 3300 + (index * 300), y: 175, width: 253, height: 349, opacity: 1 };

            for (let i = 0; i < 4; i++) {
                const id =  'plot_' + index + '_' + i;

                const card = new DuosideCard({ front: src, bg: bgSrc }, { ...options, id });
                cardsManager.createCard(card);
            }
        }
        /* КАРТОЧКИ ПРОДАНО */



        /* ЧИПСЫ */
        const chipsCount = [8, 6, 4];
        for ( const [index, value] of new Array(5).entries() ) {
            let src = '/viticulture/chip/' + (index + 1) + '/';

            for (let i = 0; i < 3; i++) {
                let count = chipsCount[i]

                for (let j = 0; j < count; j++) {
                    const options =  {
                        x: -1800 + (index * 1900) + (j * 110), y: 3500 + (i * 110),
                        draggable: true, width: 90, height: 90, cornerRadius: 5,
                        id: "chip_" + index + "_" + i + "_" + j
                    }
                    const card = new DuosideCard({ front: src + (i + 1) + '/' + (j + 1) + '.png', bg: src + (i + 1) + '/' + (j + 1) + '.png' }, options);
                    cardsManager.createCard(card);
                }
            }
        }

        const addCustomCard = (src, opts) => {
            const options =  { x: -200, y: 2300, draggable: true, width: 90, height: 90, cornerRadius: 5, ...opts };
            const card = new DuosideCard({ front:src, bg: src }, options);
            cardsManager.createCard(card);
        }

        addCustomCard('/viticulture/chip/104.png', { x: -200, y: 1500 });
        addCustomCard('/viticulture/chip/103.png', { x: -200, y: 1500 });
        /* ЧИПСЫ */



        /* ЛОЗЫ */
        for ( const [index, value] of new Array(42).entries() ) {
            const src = '/viticulture/vine/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 145 + (index + 1), y: 150 + (index + 2), width: 245, height: 401, opacity: 1, id: "vine_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/viticulture/vine/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ЛОЗЫ */


        /* summer */
        for ( const [index, value] of new Array(38).entries() ) {
            const src = '/viticulture/summer/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 855 + (index + 1), y: 150 + (index + 2), width: 245, height: 401, opacity: 1, id: "summer_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/viticulture/summer/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* summer */


        /* winter */
        for ( const [index, value] of new Array(36).entries() ) {
            const src = '/viticulture/sponsore/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 1560 + (index + 1), y: 150 + (index + 2), width: 245, height: 401, opacity: 1, id: "sponsore_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/viticulture/sponsore/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* winter */


        /* winter */
        for ( const [index, value] of new Array(38).entries() ) {
            const src = '/viticulture/winter/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2260 + (index + 1), y: 150 + (index + 2), width: 245, height: 401, opacity: 1, id: "winter_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/viticulture/winter/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* winter */


        /* mom */
        for ( const [index, value] of new Array(18).entries() ) {
            const src = '/viticulture/mom/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 800 + (index + 1), y: -400 + (index + 2), width: 478, height: 355, opacity: 1, id: "mom_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/viticulture/mom/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* mom */


        /* dad */
        for ( const [index, value] of new Array(18).entries() ) {
            const src = '/viticulture/dad/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 1700 + (index + 1), y: -400 + (index + 2), width: 478, height: 355, opacity: 1, id: "dad_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/viticulture/dad/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* dad */


        this.moduleManager.registerModule("camera", cameraModule);
        this.moduleManager.registerModule("resources", resourcesModule, config);
        this.moduleManager.registerModule("saver", saverModule);

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify("This war of mine полностью загружено!");

        ws.connect();
    }
}

export default ViticultureScene;