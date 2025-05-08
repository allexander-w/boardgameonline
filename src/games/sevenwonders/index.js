import {cardsManager, layersManager, moduleManager, ws} from "../../core";

import cameraModule from "../../modules/camera";
import saverModule from "../../modules/saver";
import resourcesModule from "../../modules/resources";

import MainScene from "../../scenes/MainScene";
import FieldCard from "../../entities/FieldCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";
import config from "./configs/resources.config"
import StateCard from "./entities/state/StateCard";

class TwomScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
    }

    initialization() {
        const table = new FieldCard({ front: '/sevenwonders/board.png', bg: null }, {
            draggable: false,
            x: 0, y: 0,
            width: 2303, height: 902,
            opacity: 0.6, id: "field"
        });

        cardsManager.createCard(table, "fixed");



        /* КАРТЫ 1 */
        for ( const [index, value] of new Array(23).entries() ) {
            const src = '/sevenwonders/I/' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1000, y: 1000, width: 531, height: 802, opacity: 1, id: "cardI_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/sevenwonders/I/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* КАРТЫ 1 */

        /* КАРТЫ 2 */
        for ( const [index, value] of new Array(23).entries() ) {
            const src = '/sevenwonders/II/' + (index + 1) + '.png';
            const options =  { draggable: true, x: -400, y: 1000, width: 531, height: 802, opacity: 1, id: "cardII_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/sevenwonders/II/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* КАРТЫ 2 */

        /* КАРТЫ 3 */
        for ( const [index, value] of new Array(20).entries() ) {
            const src = '/sevenwonders/III/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 200, y: 1000, width: 531, height: 802, opacity: 1, id: "cardIII_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/sevenwonders/III/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* КАРТЫ 3 */

        /* КАРТЫ 3 */
        for ( const [index, value] of new Array(7).entries() ) {
            const src = '/sevenwonders/G/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 800, y: 1000, width: 531, height: 802, opacity: 1, id: "cardG_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/sevenwonders/G/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* КАРТЫ 3 */

        /* Чудеса */
        for ( const [index, value] of new Array(15).entries() ) {
            const src = '/sevenwonders/wonders/' + (index + 1) + '.png';
            const options =  { draggable: true, x: -400, y: 1900, width: 1180, height: 770, opacity: 1, id: "wonder_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/sevenwonders/wonders/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* Чудеса */

        /* Токены */
        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/sevenwonders/tokens/' + (index + 1) + '.png';
            const options =  { draggable: true, x: 1000, y: 1900, width: 202, height: 202, opacity: 1, id: "token_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: src }, options);
            cardsManager.createCard(card);
        }
        /* Токены */





        this.moduleManager.registerModule("camera", cameraModule);
        this.moduleManager.registerModule("resources", resourcesModule, config);
        this.moduleManager.registerModule("saver", saverModule);

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify("Семь чудес полностью загружено!");

        ws.connect();
    }
}

export default TwomScene;