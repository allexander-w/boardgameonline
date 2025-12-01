import config from "../../../config";

export const ResourceTemplate = (item) => {
    return `
        <div class="resource-card" data-id="${ item.name }">
            <div class="resource-card__wrapper">
                <div class="res-icon">
                    <img src="/${config.scene}/resources/${item.name}.png" alt="">
                </div>
                <div class="res-val">${item.name}</div>
            </div>
            
            <div style="font-size: 0.7rem; color: var(--text-muted);">${item.selected ? `<span> В руках: ${item.selected} </span>` : ''}</div>
        </div>
    `
}

const SearchTemplate = () => {
    return `
        <div class="chat-input-area">
            <input type="text" class="chat-input resources-search-input" placeholder="Поиск по ресурсам...">
        </div>
    `
}

export const ResourcesListTemplate = (list) => {
    return `
        <div class="resources-wrapper">
            <h4 style="margin-bottom: 15px; color: var(--text-muted);">Ресурсы</h4>
        
            ${SearchTemplate()}

            <div class="resource-grid">
                ${list.map(el => ResourceTemplate(el)).join("")} 
            </div>
        </div>
    `
}