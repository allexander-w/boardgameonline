class ActionsModule {
    constructor(uiManager, cardsManager) {
        this.selected = null;
        this.uiManager = uiManager;
        this.cardsManager = cardsManager;
    }

    select(e) {
        const element = this.cardsManager.getCard(e.target.id());
        this.selected = element;

        this.uiManager.renderUI(element);
    }

    selectCouple(count) {
        this.uiManager.renderGroupUI(count);
    }

}

export default ActionsModule;