function GameInterface() {
    this.modules = new Map();

    this.addModule = (name, module) => {
        this.modules.set(name, module);
        if ( !module.init ) return false;

        module.init();
        return true;
    }

    this.getModule = (name) => {
        return this.modules.get(name) || null;
    }
}

export default Object.freeze(new GameInterface());