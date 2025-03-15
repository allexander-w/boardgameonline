import HtmlGenerator from "../../core/markup/HtmlGenerator";
import {NotificationItemTemplate} from "./templates/notifications.template";

function NotificationsModule() {
    this.notifications = [];

    const generator = new HtmlGenerator();
    let interval = null;


    this.removeLastNotification = () => {
        if ( interval && !this.notifications.length ) {
            clearInterval(interval);
            interval = null;
            return false;
        }

        this.notifications.pop();

        const wrapper = generator.getNode("#notifications");
        generator.removeLastChild(wrapper);
    }

    this.notify = (message, type) => {
        this.notifications.push(message);
        if ( !interval ) interval = setInterval(this.removeLastNotification, 3000);

        const wrapper = generator.getNode("#notifications");
        generator.appendToBegin(wrapper, NotificationItemTemplate(message, type));
    }

    this.init = () => {
        console.log("notifications module registered");
    }
}

export default NotificationsModule;