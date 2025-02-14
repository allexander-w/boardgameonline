export const hiddenItem = (name, count, id) => {
    return `
        
        <div class="hiddens-wrapper-item" title="${ name }" data-id="${ id }">
            <div class="hidden__item"></div>
            <div class="shadow"></div>
            <p>${ count }</p>
        </div>

    `
}