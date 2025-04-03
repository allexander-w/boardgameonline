const toLocalTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export const NotificationItemTemplate = (message) => {
    return `
        
        <div class="notification">
            <span>${ toLocalTime() }</span>
            <p>${ message }</p>
        </div>

    `
}