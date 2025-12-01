class NotificationsModule {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.notifications = [];
    }

    notify(message, options) {
        this.notifications.push(message);
        this.uiManager.updateMessageUI(message, options);
    }

    render() {
        return this.uiManager.getAllMessages(this.notifications.reverse());
    }
}

export default NotificationsModule;