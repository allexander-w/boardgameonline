import ResourceCard from "../../entities/resource/ResourceCard";

class ActionsModule {
    constructor(uiManager, cardsManager) {
        this.selected = null;
        this.uiManager = uiManager;
        this.cardsManager = cardsManager;

        this.exceptions = [ResourceCard];
    }

    select(e) {
        const element = this.cardsManager.getCard(e.id());
        if ( this.exceptions.every(el => element instanceof el) ) return false;

        this.selected = element;
        this.uiManager.renderUI(element);
    }

    selectCouple(count) {
        this.uiManager.renderGroupUI(count);
    }

}

export default ActionsModule;