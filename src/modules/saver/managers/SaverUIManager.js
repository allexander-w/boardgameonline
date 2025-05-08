import {SaveButtonTemplate} from "../templates/saver.templates";

class SaverUIManager {
    constructor(generator) {
        this.generator = generator;
    }

    getWrapper() {
        return this.generator.getNode(".saver");
    }

    createSaveButton() {
        const wrapper = this.generator.getNode(".right-menu");
        this.generator.appendToBegin(wrapper, SaveButtonTemplate);
    }

    getSaveButton() {

    }

    getSaveMenu() {
        return SaveButtonTemplate;
    }
}

export default SaverUIManager;