class TabsModule {
    constructor(uiManager, emitter) {
        this.tabs = {};
        this.uiManager = uiManager;
        this.emitter = emitter;

        this.selected = null;
    }

    render(id) {
        if (!this.tabs[id]) return;

        this.emitter.emit("modules.tabs.prerender", id);

        this.uiManager.setActiveChild(id);
        this.uiManager.renderContent(this.tabs[id]() || '');
        this.selected = id;

        this.emitter.emit("modules.tabs.rendered", id);
    }

    select(e) {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;

        const id = btn.dataset.id;
        if (this.selected === id) return;

        this.render(id);
    }

    registerTab(id, name, renderer) {
        this.tabs[id] = renderer;
        this.uiManager.addTab(id, name);

        if ( Object.keys(this.tabs)?.length === 1 ) this.render(id);
    }
}

export default TabsModule;