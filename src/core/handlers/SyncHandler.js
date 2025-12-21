import config from "../../config";
import {cardsManager} from "../index";
import ResourceCard from "../../entities/resource/ResourceCard";

class SyncHandler {
    constructor(usersManager, cardsManger, layersManager, sender, emitter) {
        this.usersManager = usersManager;
        this.cardsManager = cardsManger;
        this.layersManager = layersManager;
        this.sender = sender;
        this.emitter = emitter;

        this.emitter.on("api.register.joined", this.getConfig.bind(this));
        this.emitter.on("api.register.sync", this.loadConfig.bind(this));
    }

    getConfig() {
        if ( this.usersManager.user.id !== this.usersManager.syncPoint ) return false;

        const save = {
            timestamp: new Date(),
            elements: [],
            resources: []
        }

        for ( const [key, card] of this.cardsManager.cards.entries() ) {
            const config = card.forSave;
            if ( config.resource ) save.resources.push(config);
            else save.elements.push(config);
        }

        this.sender.send("api.register.sync", save);
    }

    loadConfig(data) {
        const save = data;
        this.layersManager.clearCacheAllGroups();

        for ( const el of save.resources ) {
            if ( cardsManager.cards.has(el.id) ) return false;
            const options =  { draggable: true, x: el.x, y: el.y, width: el.width, height: el.height, opacity: 1, id: el.id };
            const resourceCard = new ResourceCard({ front: el.src }, options);
            cardsManager.createCard(resourceCard);
        }

        for ( const el of save.elements ) {
            const card = cardsManager.getCard(el.id);
            card.forLoad(el);
        }

        this.layersManager.cacheAllGroups();
    }
}

export default SyncHandler;