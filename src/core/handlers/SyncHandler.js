import { applySave } from "../initialize/applySave";

class SyncHandler {
    constructor(usersManager, cardsManger, layersManager, sender, emitter) {
        this.usersManager = usersManager;
        this.cardsManager = cardsManger;
        this.layersManager = layersManager;
        this.sender = sender;
        this.emitter = emitter;

        this.initialSyncHandled = false;

        this.emitter.on("api.register.joined", this.getConfig.bind(this));
        this.emitter.on("api.register.sync", this.loadConfig.bind(this));
        this.emitter.on("api.register.join", this.onJoined.bind(this));

        this.startAutosave();
    }

    onJoined() {
        this.initialSyncHandled = true;
    }


    canSync() {
        const { user, syncPoint } = this.usersManager;

        return this.initialSyncHandled
            && this.sender.adapter.ready
            && !!user.id
            && user.id === syncPoint
            && this.cardsManager.cards.size > 0;
    }

    buildSave() {
        const save = {
            timestamp: new Date(),
            elements: [],
            resources: []
        }

        for ( const card of this.cardsManager.cards.values() ) {
            let config;

            try {
                config = card.forSave;
            } catch (e) {
                console.error("[sync] не удалось сохранить карту", card?.element?.id?.(), e);
                continue;
            }

            if ( !config ) continue;

            if ( config.resource ) save.resources.push(config);
            else save.elements.push(config);
        }

        return save;
    }

    getConfig() {
        if ( !this.canSync() ) return false;
        this.sender.send("api.register.sync", this.buildSave());
    }

    checkpoint() {
        if ( !this.canSync() ) return false;

        const save = this.buildSave();
        if ( !save.elements.length && !save.resources.length ) return false;

        return this.sender.send("api.room.checkpoint", save);
    }

    startAutosave() {
        setInterval(() => {
            this.checkpoint();
        }, 30000);

        this.emitter.on("system.websockets.unloading", () => this.checkpoint());
    }

    loadConfig(data) {
        applySave(data, { hands: data.hands || [] });
    }
}

export default SyncHandler;
