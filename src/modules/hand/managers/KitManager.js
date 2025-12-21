class KitManager {
    constructor(isHandsHas) {
        this.kit = {
            default: {
                stack: new Set(),
                active: true
            }
        }

        this.isHandsHas = isHandsHas;
    }

    _generateUniqueId(length = 4) {
        return Math.random().toString(36).substr(2, length);
    }

    get _defaultKitItem() {
        return {
            stack: new Set(),
            active: false
        }
    }

    get handKit() {
        return Object.entries(this.kit);
    }

    getActiveKitId() {
        let output = "";
        for( const [kitId, kitItem] of Object.entries(this.kit) ) {
            if ( kitItem.active ) {
                output = kitId;
                break;
            }
        }

        return output;
    }

    getActiveKitStack() {
        const id = this.getActiveKitId();
        return this.kit[id].stack;
    }

    changeActive(id) {
        for ( const [kitId, kitItem] of Object.entries(this.kit) ) {
            if ( kitId === id ) {
                this.kit[id].active = true;
                continue;
            }
            this.kit[kitId].active = false;
        }
    }

    add(kitId) {
        if ( Object.keys(this.kit).length >= 4 ) return false;
        const id = kitId || this._generateUniqueId();
        this.kit[kitId || id] = this._defaultKitItem;

        this.changeActive(id);
        return id;
    }

    remove(id) {
        if ( !this.kit[id] ) return false;
        delete this.kit[id];
    }

    addToStack(cardId) {
        if ( !this.isHandsHas(cardId) ) {
            console.warn("Для данной карты: ", cardId, " нет подходящей ссылки!");
            return false;
        }

        const kitId = this.getActiveKitId();
        if ( !this.kit[kitId] ) return false;

        this.kit[kitId].stack.add(cardId);
    }

    removeFromStack(cardId) {
        if ( !this.isHandsHas(cardId) ) {
            console.warn("Для данной карты: ", cardId, " нет подходящей ссылки!");
            return false;
        }

        const kitId = this.getActiveKitId();

        if ( !this.kit[kitId] ) return false;
        this.kit[kitId].stack.delete(cardId);

        if ( !this.kit[kitId].stack.size ) {
            this.remove(kitId);
            if ( kitId === "default" ) this.add("default");
            this.changeActive("default");
        }
    }
}

export default KitManager;