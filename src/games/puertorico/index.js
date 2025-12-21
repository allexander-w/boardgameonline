import MainScene from "../../scenes/MainScene";
import {cardsManager, emitter, layersManager, moduleManager, ws} from "../../core";
import FieldCard from "../../entities/FieldCard";
import cameraModule from "../../modules/camera";
import resourcesModule from "../../modules/resources";
import config from "./config/resources.config";
import saverModule from "../../modules/saver";
import StateCard from "../thiswarofmine/entities/state/StateCard";
import DuosideCard from "../../entities/duoside/DuosideCard";
import DiceCard from "../../entities/dice/DiceCard";

class PuertoRicoScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Виноделие успешно загружено"));
    }

    initialization() {
        const registerDuosideCardsArray = (count, id, position, size, format, opts) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/puertorico/${id}/${index + 1}.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, ...opts, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/puertorico/${id}/bg.${ format || 'png' }` }, options);
                cardsManager.createCard(card);
            }
        }

        const registerDuosideSameBGCardsArray = (count, id, position, size, format, opts) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/puertorico/${id}/${index + 1}.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, ...opts, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: src }, options);
                cardsManager.createCard(card);
            }
        }

        const registerDuosideCardsWithBGArray = (count, id, position, size, format, opts) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/puertorico/${id}/${index + 1}.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, ...opts, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/puertorico/${id}/bg_${index + 1}.${ format || 'png' }` }, options);
                cardsManager.createCard(card);
            }
        }

        const registerSameDuosideCardsArray = (count, id, position, size, format, name) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/puertorico/${id}/${ name || '1' }.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, opacity: 1, id: `${id}_${name || '1'}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/puertorico/${id}/bg.${ format || 'png' }` }, options);
                cardsManager.createCard(card);
            }
        }

        const registerSameDuosideSameBGCardsArray = (count, id, position, size, format, name) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/puertorico/${id}/${ name || '1' }.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, opacity: 1, id: `${id}_${name || '1'}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: src }, options);
                cardsManager.createCard(card);
            }
        }

        const registerStateCardsArray = (count, id, position, size, format) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/puertorico/${id}/${index + 1}.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new StateCard([src], options);
                cardsManager.createCard(card);
            }
        }

        const table = new FieldCard({ front: '/puertorico/field.webp', bg: null }, {
            draggable: false,
            x: 0, y: 0,
            width: 1357 * 1.8, height: 1920 * 1.8,
            opacity: 1, id: "field"
        });

        cardsManager.createCard(table, "fixed");


        registerDuosideCardsWithBGArray(8, "bigbuilds", { x: 0, y: 0 }, { w: 477, h: 570 }, 'webp');
        registerDuosideCardsWithBGArray(28, "builds", { x: 500, y: 0 }, { w: 480, h: 285 }, 'webp');
        registerDuosideCardsArray(26, "fabrics", { x: 500, y: 0 }, { w: 480, h: 285 }, 'webp');

        const plants = {
            1: 11,
            2: 9,
            3: 10,
            4: 12,
            5: 8
        }

        for ( const [key, value] of Object.entries(plants) ) {
            registerSameDuosideCardsArray(value, "plant", { x: 900 + (300 * key), y: 0 }, { w: 300, h: 308 }, 'png', key);
        }

        const products = {
            1: 9,
            2: 9,
            3: 10,
            4: 11,
            5: 11
        }

        for ( const [key, value] of Object.entries(products) ) {
            registerSameDuosideSameBGCardsArray(value, "products", { x: 1200, y: 400 }, { w: 130, h: 129 }, "png", key);
        }

        registerDuosideSameBGCardsArray(10, "roles", { x: 0, y: 1000 }, { w: 477, h: 783 }, 'webp' );
        registerDuosideSameBGCardsArray(6, "ships", { x: 1000, y: 1000 }, { w: 630, h: 1115 }, 'png' );
        registerSameDuosideCardsArray(8, "stone", { x: 1800, y: 400 }, { w: 300, h: 308 }, 'png');
        registerSameDuosideCardsArray(2, "fields", { x: 0, y: 2000 }, { w: 1920 * 1.8, h: 1370 * 1.8 }, 'webp', "1");
        registerSameDuosideCardsArray(42, "meepl", { x: 2000, y: 2000 }, { w: 130, h: 130 }, 'webp', "1");


        this.moduleManager.registerModule("resources", resourcesModule, config);
    }
}

export default PuertoRicoScene;