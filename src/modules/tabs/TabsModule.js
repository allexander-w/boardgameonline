class TabsModule {
    constructor(uiManager, emitter) {
        this.tabs = {};
        this.uiManager = uiManager;
        this.emitter = emitter;

        this.selected = null;
    }

    _render(id) {
        this.uiManager.setActiveChild(id);
        const content = this.tabs[id]() || '';
        this.uiManager.renderContent(content);
    }

    select(e) {
        if ( this.selected === e.target.dataset.id ) return false;
        this.emitter.emit("modules.tabs.prerender", e.target.dataset.id);

        this._render(e.target.dataset.id);

        this.emitter.emit("modules.tabs.rendered", e.target.dataset.id);
        this.selected = e.target.dataset.id;
    }

    registerTab(id, name, renderer) {
        this.tabs[id] = renderer;
        this.uiManager.addTab(id, name);

        if ( Object.keys(this.tabs)?.length === 1 ) this._render(id);
    }
}

export default TabsModule;