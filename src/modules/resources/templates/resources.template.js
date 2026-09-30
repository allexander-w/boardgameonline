import config from "../../../config";
import {gameManager} from "../../../core";

export const ResourceTemplate = (item) => {
    const getUri = () => {
        return `/${ gameManager.getId() }/resources/${item.name}.png`
    }

    return `
        <div class="resource-card" data-id="${ item.name }">
            <div class="resource-card__wrapper">
                <div class="res-icon">
<!--                    <img src="${ config.s3BaseUrl(getUri()) }" alt="">-->
                    <img src="${ getUri() }" alt="">
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