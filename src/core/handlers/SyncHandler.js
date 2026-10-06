import { applySave } from "../initialize/applySave";

class SyncHandler {
    constructor(usersManager, cardsManger, layersManager, sender, emitter) {
        this.usersManager = usersManager;
        this.cardsManager = cardsManger;
        this.layersManager = layersManager;
        this.sender = sender;
        this.emitter = emitter;

        this.emitter.on("api.register.joined", this.getConfig.bind(this));
        this.emitter.on("api.register.sync", this.loadConfig.bind(this));

        this.startAutosave();
    }

    buildSave() {
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

        return save;
    }

    getConfig() {
        if ( this.usersManager.user.id !== this.usersManager.syncPoint ) return false;
        this.sender.send("api.register.sync", this.buildSave());
    }

    checkpoint() {
        const { user, syncPoint } = this.usersManager;
        if ( !this.sender.adapter.ready || !user.id || user.id !== syncPoint ) return;
        this.sender.send("api.room.checkpoint", this.buildSave());
    }

    startAutosave() {
        setInterval(() => {
            this.checkpoint();
        }, 30000);

        window.addEventListener("pagehide", () => this.checkpoint());
    }

    loadConfig(data) {
        applySave(data, { hands: data.hands || [] });
    }
}

export default SyncHandler;