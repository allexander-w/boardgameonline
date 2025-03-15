export const NotificationItemTemplate = (message, type='default') => {
    return `
        
        <div class="notification" data-type="${ type }">
            <p>!</p>
            <p>${ message }</p>
        </div>

    `
}