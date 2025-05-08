class NotificationsModule {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.notifications = [];
    }

    notify(message, options) {
        this.notifications.push(message);
        this.uiManager.updateMessageUI(message, options);
    }
}

export default NotificationsModule;