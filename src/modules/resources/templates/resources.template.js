import config from "../../../config";

export const ResourceTemplate = (item) => {
    return `
        <div class="resource-item" data-id="${ item.name }">
            <img src="/${ config.scene }/resources/${item.name}.png" alt="">
            ${ item.selected ? `<span> ${ item.selected } </span>` : '' }
        </div>
    `
}

const SearchTemplate = () => {
    return `
        <div class="search">
            <input class="search-input" type="text" placeholder="Фильтр">
        </div>
    `
}

export const ResourcesListTemplate = (list) => {
    return `
        <div class="resources-wrapper">
            ${ SearchTemplate() }

            <div class="resources-list"> 
                ${ list.map(el => ResourceTemplate(el)).join("") } 
            </div>
        </div>
    `
}