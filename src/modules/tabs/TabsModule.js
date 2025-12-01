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
        const parent = e.target.closest('.tab-btn');

        if ( this.selected === parent.dataset.id ) return false;
        this.emitter.emit("modules.tabs.prerender", parent.dataset.id);

        this._render(parent.dataset.id);

        this.emitter.emit("modules.tabs.rendered", parent.dataset.id);
        this.selected = parent.dataset.id;
    }

    registerTab(id, name, renderer) {
        this.tabs[id] = renderer;
        this.uiManager.addTab(id, name);

        if ( Object.keys(this.tabs)?.length === 1 ) this._render(id);
    }
}

export default TabsModule;