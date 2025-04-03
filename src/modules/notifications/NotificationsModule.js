class NotificationsModule {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.notifications = [];
    }

    notify(message) {
        this.notifications.push(message);
        this.uiManager.updateMessageUI(message);
    }
}

export default NotificationsModule;