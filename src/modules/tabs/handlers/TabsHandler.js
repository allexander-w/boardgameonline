class TabsHandler {
    constructor(tabsModule, uiManager) {
        this.tabsModule = tabsModule;
        this.uiManager = uiManager;

        const tabsListTemplate = this.uiManager.getTabsWindow();
        tabsListTemplate.addEventListener("click", this.tabsModule.select.bind(this.tabsModule));
    }

}

export default TabsHandler;