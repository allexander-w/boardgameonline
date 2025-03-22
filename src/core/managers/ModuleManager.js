class ModuleManager {
    constructor() {
        this.modules = new Map();
    }

    registerModule(key, module) {
        this.modules.set(key, module);
        if ( !module.init ) return false;

        module.init();
        return true;
    }

    getModule(key) {
        return this.modules.get(key)?.module || null;
    }
}

export default ModuleManager;