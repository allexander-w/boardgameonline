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
        const table = new FieldCard({ front: '/thiswarofmine/board.png', bg: null }, {
            draggable: false,
            x: 0, y: 0,
            width: 2788 * 2.1, height: 1869 * 2.1,
            opacity: 0.6, id: "field"
        });

        cardsManager.createCard(table, "fixed");


        /* ТОКЕНЫ */
        const tokens = [
            { folder: "1", imagesCount: 4, width: 228, height: 110, count: 4 },
            { folder: "2", imagesCount: 4, width: 228, height: 110, count: 4 },
            { folder: "3", imagesCount: 4, width: 228, height: 110, count: 4 },
            { folder: "4", imagesCount: 4, width: 228, height: 110, count: 4 },
            { folder: "5", imagesCount: 4, width: 228, height: 110, count: 4 },
            { folder: "6", imagesCount: 3, width: 147, height: 147, count: 1 },
            { folder: "7", imagesCount: 2, width: 147, height: 147, count: 1 },
            { folder: "8", imagesCount: 3, width: 147, height: 147, count: 1 },
        ]

        for ( const [i, el] of tokens.entries() ) {
            let src = [];

            for ( const [index, value] of new Array(el.imagesCount).entries() ) {
                src.push('/thiswarofmine/tokens/' + el.folder + "/" + (index + 1) + '.png');
            }


            for ( const [index, value] of new Array(el.count).entries() ) {
                const options =  { draggable: true, x: -2700, y: 2400 + (i * 170), id: "token_" + el.folder + "_" + (index + 1), opacity: 1, width: el.width, height: el.height };

                const token = new StateCard(src, options);
                cardsManager.createCard(token);
            }
        }
        /* ТОКЕНЫ */


        /* РЕШАЮЩИЕ ДЕЙСТВИЯ */
        for ( const [index, value] of new Array(15).entries() ) {
            const src = '/thiswarofmine/actions/act-' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2520 + (index + 2), y: -660 + (index + 2), width: 556, height: 396, opacity: 1, id: "action_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/actions/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* РЕШАЮЩИЕ ДЕЙСТВИЯ */


        /* ЦЕЛИ */
        for ( const [index, value] of new Array(7).entries() ) {
            const src = '/thiswarofmine/aims/aim-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -260 + (index + 2), y: -1659 + (index + 2), width: 556, height: 396, opacity: 1, id: "aims_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/aims/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ЦЕЛИ */

        /* ЦВЕТА */
        for ( const [index, value] of new Array(5).entries() ) {
            const src = '/thiswarofmine/colors/col-' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2519 + (index + 2), y: -148 + (index + 2), width: 556, height: 396, opacity: 1, id: "colors_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/colors/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ЦВЕТА */


        /* ИССЛЕДОВАНИЯ  */
        for ( const [index, value] of new Array(26).entries() ) {
            const src = '/thiswarofmine/discoveries/dis-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -2594 + (index + 2), y: 911 + (index + 2), width: 398, height: 553, opacity: 1, id: "discoveries_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/discoveries/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ИССЛЕДОВАНИЯ */


        /* СОБЫТИЯ  */
        for ( const [index, value] of new Array(12).entries() ) {
            const src = '/thiswarofmine/events/ev-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -951 + (index + 4), y: -1651 + (index + 4), width: 553, height: 398, opacity: 1, id: "events_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/events/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* СОБЫТИЯ */


        /* СУДЬБА  */
        for ( const [index, value] of new Array(7).entries() ) {
            const src = '/thiswarofmine/fate/fate-' + (index + 1) + '.png';
            const options =  { draggable: true, x: 2532 + (index + 4), y: -1152 + (index + 4), width: 553, height: 398, opacity: 1, id: "fate_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/fate/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* СУДЬБА */

        /* НАХОДКИ */
        for ( const [index, value] of new Array(11).entries() ) {
            const src = '/thiswarofmine/finds/fd-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1577 + (index + 4), y: 948 + (index + 4), width: 398, height: 553, opacity: 1, id: "finds_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/finds/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* НАХОДКИ */

        /* ГОСТИ */
        for ( const [index, value] of new Array(12).entries() ) {
            const src = '/thiswarofmine/guests/gst-' + (index + 1) + '.png';
            const options =  { draggable: true, x: 444 + (index + 4), y: -1661 + (index + 4), width: 553, height: 398, opacity: 1, id: "guests_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/guests/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ГОСТИ */

        /* МЕСТНЫЕ */
        for ( const [index, value] of new Array(14).entries() ) {
            const src = '/thiswarofmine/locals/l-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -2107 + (index + 4), y: 933 + (index + 4), width: 398, height: 553, opacity: 1, id: "locals_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/locals/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* МЕСТНЫЕ */

        /* ЛОКАЦИИ */
        for ( const [index, value] of new Array(18).entries() ) {
            const src = '/thiswarofmine/locations/loc-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -2300 + (index + 4), y: -1657 + (index + 4), width: 553, height: 398, opacity: 1, id: "locations_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/locations/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ЛОКАЦИИ */

        /* НОЧНОЙ НАЛЕТ */
        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/thiswarofmine/night/n-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1100 + (index + 4), y: 948 + (index + 4), width: 398, height: 553, opacity: 1, id: "night_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/night/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* НОЧНОЙ НАЛЕТ */

        /* ПЕРСОНАЖИ */
        for ( const [index, value] of new Array(6).entries() ) {
            const src = '/thiswarofmine/persons/per-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1910 + (index + 4), y: 2854 + (index + 4), width: 398, height: 553, opacity: 1, id: "persons_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/persons/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ПЕРСОНАЖИ */

        /* ПЕРСОНАЖИ */
        for ( const [index, value] of new Array(6).entries() ) {
            const src = '/thiswarofmine/persons_hard/per-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1012 + (index + 4), y: 2854 + (index + 4), width: 398, height: 553, opacity: 1, id: "persons_hard_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/persons_hard/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ПЕРСОНАЖИ */

        /* УЛУЧШЕНИЯ */
        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/thiswarofmine/ideas/bg-' + (index + 1) + '.png';
            const bg = '/thiswarofmine/ideas/th-' + (index + 1) + '.png';

            const options =  { draggable: true, x: 3268 + (index + 4), y: -1596 + (index + 4), width: 398, height: 553, opacity: 1, id: "ideas_" + (index + 1) };

            const card = new DuosideCard({ front: bg, bg: src }, options);
            cardsManager.createCard(card);
        }
        /* УЛУЧШЕНИЯ */

        /* УЛУЧШЕНИЯ */
        for ( const [index, value] of new Array(10).entries() ) {
            const src = '/thiswarofmine/improves/bg-' + (index + 1) + '.png';
            const bg = '/thiswarofmine/improves/th-' + (index + 1) + '.png';

            const options =  { draggable: true, x: 3268 + (index + 4), y: -868 + (index + 4), width: 398, height: 553, opacity: 1, id: "improves_" + (index + 1) };

            const card = new DuosideCard({ front: bg, bg: src }, options);
            cardsManager.createCard(card);
        }
        /* УЛУЧШЕНИЯ */


        /* ГЛАВЫ */
        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/thiswarofmine/chapters/bg-' + (index + 1) + '.png';
            const bg = '/thiswarofmine/chapters/ch-' + (index + 1) + '.png';

            const options =  { draggable: true, x: -971 + (index + 4), y: -2134 + (index + 4), width: 553, height: 398, opacity: 1, id: "chapters_" + (index + 1) };

            const card = new DuosideCard({ front: bg, bg: src }, options);
            cardsManager.createCard(card);
        }
        /* ГЛАВЫ */

        /* ЗАПЕРТАЯ ДВЕРЬ */
        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/thiswarofmine/closedoors/cd-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -1072 + (index + 4), y: -1058 + (index + 4), width: 398, height: 553, opacity: 1, id: "closedoors_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/closedoors/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ЗАПЕРТАЯ ДВЕРЬ */

        /* ЗАВАЛЫ */
        for ( const [index, value] of new Array(6).entries() ) {
            const src = '/thiswarofmine/blockage/b-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -600 + (index + 4), y: -1058 + (index + 4), width: 396, height: 556, opacity: 1, id: "blockage_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/blockage/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* ЗАВАЛЫ */

        /* МЕБЕЛЬ */
        for ( const [index, value] of new Array(5).entries() ) {
            const src = '/thiswarofmine/furniture/f-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -100 + (index + 4), y: -1058 + (index + 4), width: 396, height: 556, opacity: 1, id: "furniture_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/furniture/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* МЕБЕЛЬ */

        /* МУСОР */
        for ( const [index, value] of new Array(4).entries() ) {
            const src = '/thiswarofmine/trash/t-' + (index + 1) + '.png';
            const options =  { draggable: true, x: 389 + (index + 4), y: -1058 + (index + 4), width: 396, height: 556, opacity: 1, id: "trash_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/trash/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* МУСОР */

        /* СОБЫТИЯ  */
        for ( const [index, value] of new Array(3).entries() ) {
            const src = '/thiswarofmine/endevents/ee-' + (index + 1) + '.png';
            const options =  { draggable: true, x: -280 + (index + 4), y: -2126 + (index + 4), width: 553, height: 398, opacity: 1, id: "endevents_" + (index + 1) };

            const card = new DuosideCard({ front: src, bg: '/thiswarofmine/endevents/bg.png' }, options);
            cardsManager.createCard(card);
        }
        /* СОБЫТИЯ */

        /* Рендер костей */
        const redDice = new DiceCard({ front: '/thiswarofmine/dice/red/dice-sprite.png' }, { x: -2911, y: 2139, id: "dice1" });
        cardsManager.createCard(redDice);

        const grayDice = new DiceCard({ front: '/thiswarofmine/dice/gray/dice-sprite.png' }, { x: -2711, y: 2139, id: "dice2" });
        cardsManager.createCard(grayDice);

        const yellowDice = new DiceCard({ front: '/thiswarofmine/dice/yellow/dice-sprite.png' }, { x: -2511, y: 2139, id: "dice3" });
        cardsManager.createCard(yellowDice);

        const d10 = new DiceCard({ front: '/dice/d10.png' }, { x: -2311, y: 2139, id: "dice4", sides: 10 });
        cardsManager.createCard(d10);

        // {x: -2711.373090366681, y: 2139.5407468101944}

        this.moduleManager.registerModule("camera", cameraModule);
        this.moduleManager.registerModule("resources", resourcesModule, config);
        this.moduleManager.registerModule("saver", saverModule);

        const notificationManager = this.moduleManager.getModule("notifications");
        notificationManager.notify("This war of mine полностью загружено!");

        ws.connect();
    }
}

export default TwomScene;