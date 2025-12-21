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

class BurgundScene extends MainScene {
    constructor(preloadScreen) {
        super(layersManager, ["fixed"], preloadScreen, moduleManager);
        this.moduleManager = moduleManager;

        this.initialization();
        emitter.on("screen.preloader.finish", this.initialized.bind(this, "Виноделие успешно загружено"));
    }

    initialization() {
        const registerDuosideCardsArray = (count, id, position, size, format, opts) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/burgund/${id}/${index + 1}.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, ...opts, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/burgund/${id}/bg.${ format || 'png' }` }, options);
                cardsManager.createCard(card);
            }
        }

        const registerSameDuosideCardsArray = (count, id, position, size, format) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/burgund/${id}/1.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new DuosideCard({ front: src, bg: `/burgund/${id}/bg.${ format || 'png' }` }, options);
                cardsManager.createCard(card);
            }
        }

        const registerStateCardsArray = (count, id, position, size, format) => {
            for ( const [index, value] of new Array(count).entries() ) {
                const src = `/burgund/${id}/${index + 1}.${ format || 'png' }`
                const options =  { draggable: true, x: position.x, y: position.y, width: size.w, height: size.h, opacity: 1, id: `${id}_` + (index + 1) };

                const card = new StateCard([src], options);
                cardsManager.createCard(card);
            }
        }

        const table = new FieldCard({ front: '/burgund/field.jpg', bg: null }, {
            draggable: false,
            x: 1756, y: 1500,
            width: 3752, height: 2831,
            opacity: 0.65, id: "field"
        });

        cardsManager.createCard(table, "fixed");

        registerDuosideCardsArray(40, "black", { x: 0, y: 0 }, { w: 275, h: 315 });
        registerSameDuosideCardsArray(14, "darkgreen", { x: 300, y: 0 }, { w: 275, h: 315 });
        registerDuosideCardsArray(40, "darkyellow", { x: 600, y: 0 }, { w: 275, h: 315 });
        registerSameDuosideCardsArray(10, "gray", { x: 900, y: 0 }, { w: 275, h: 315 });
        registerDuosideCardsArray(20, "green", { x: 1200, y: 0 }, { w: 275, h: 315 });
        registerSameDuosideCardsArray(20, "ship", { x: 1500, y: 0 }, { w: 275, h: 315 });
        registerDuosideCardsArray(42, "products", { x: 1800, y: 0 }, { w: 243, h: 243 });
        registerDuosideCardsArray(6, "bonusmin", { x: 2100, y: 0 }, { w: 188, h: 188 });
        registerDuosideCardsArray(6, "bonusmax", { x: 2400, y: 0 }, { w: 230, h: 230 });
        registerDuosideCardsArray(4, "bonus", { x: 2700, y: 0 }, { w: 275, h: 315 });
        registerDuosideCardsArray(12, "pane", { x: 1400, y: 4000 }, { w: 1920*1.5, h: 1358*1.5 }, null, { ban: true });

        const redDice = new DiceCard({ front: '/dice/d6-pink.png' }, { x: 0, y: -300, id: "dice1" });
        cardsManager.createCard(redDice);

        const redDice2 = new DiceCard({ front: '/dice/d6-pink.png' }, { x: 0, y: -300, id: "dice2" });
        cardsManager.createCard(redDice2);

        const yellowDice = new DiceCard({ front: '/dice/d6-gold.png' }, { x: 300, y: -300, id: "dice3" });
        cardsManager.createCard(yellowDice);

        const yellowDice2 = new DiceCard({ front: '/dice/d6-gold.png' }, { x: 300, y: -300, id: "dice4" });
        cardsManager.createCard(yellowDice2);

        const dice = new DiceCard({ front: '/dice/dice-sprite.png' }, { x: 600, y: -300, id: "dice5" });
        cardsManager.createCard(dice);

        registerDuosideCardsArray(20, "yellow", { x: -300, y: 0 }, { w: 275, h: 315 });

        this.moduleManager.registerModule("resources", resourcesModule, config);
    }
}

export default BurgundScene;