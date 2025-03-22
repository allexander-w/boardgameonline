class HandlerManager {
    constructor() {
        this.handlers = new Map();
    }

    registerHandle(key, handler) {
        this.handlers.set(key, handler);
        if ( !handler ) return false;

        return true;
    }

    getHandler(key) {
        return this.handlers.get(key) || null;
    }
}

export default HandlerManager;