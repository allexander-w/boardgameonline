import {NotificationItemTemplate} from "../templates/notifications.template";

class UIManager {
    constructor(generator) {
        this.generator = generator;
    }

    updateMessageUI(message, options) {
        const wrapper = this.generator.getNode("#history");
        this.generator.appendToBegin(wrapper, NotificationItemTemplate(message, options));
    }
}

export default UIManager;