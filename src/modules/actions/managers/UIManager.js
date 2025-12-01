import {SelectedCardTemplate, EmptyActionsTemplate, SelectedGroupCardTemplate} from "../templates/actions.templates";

class UIManager {
    constructor(generator) {
        this.generator = generator;
        const wrapper = this.generator.getNode(".tool-tray-cards");
        this.generator.appendToBegin(wrapper, EmptyActionsTemplate);
    }

    renderUI(el) {
        const wrapper = this.generator.getNode(".tool-tray-cards");
        wrapper.innerText = '';
        this.generator.appendToBegin(wrapper, SelectedCardTemplate(el));
    }

    renderGroupUI(count) {
        const wrapper = this.generator.getNode(".tool-tray-cards");
        wrapper.innerText = '';
        this.generator.appendToBegin(wrapper, SelectedGroupCardTemplate(count));
    }
}

export default UIManager;