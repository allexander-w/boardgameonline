const toLocalTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export const NotificationItemTemplate = (message, options) => {
    return `
        
        <div class="log-entry">
            <span>${ toLocalTime() }</span>
            <p style="color: ${options?.color || '#fff'}">${ message }</p>
        </div>

    `
}

export const NotificationsTabContent = (messages) => {
    return `
        <div class="log-content" style="flex: 1; overflow-y: auto;">
            ${ messages.map(el => NotificationItemTemplate(el)).join("") }
        </div>
    `
}