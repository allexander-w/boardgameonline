import {NotificationItemTemplate, NotificationsTabContent} from "../templates/notifications.template";

class UIManager {
    constructor(generator) {
        this.generator = generator;
    }

    updateMessageUI(message, options) {
        const wrapper = this.generator.getNode(".log-content");
        if ( !wrapper ) return false;
        this.generator.appendToBegin(wrapper, NotificationItemTemplate(message, options));
    }

    getAllMessages(messages) {
        return NotificationsTabContent(messages);
    }
}

export default UIManager;