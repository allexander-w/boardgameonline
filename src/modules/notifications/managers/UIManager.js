import {NotificationItemTemplate} from "../templates/notifications.template";

class UIManager {
    constructor(generator) {
        this.generator = generator;
    }

    updateMessageUI(message) {
        const wrapper = this.generator.getNode("#history");
        this.generator.appendToBegin(wrapper, NotificationItemTemplate(message));
    }
}

export default UIManager;