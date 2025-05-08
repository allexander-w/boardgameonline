export const EmptyActionsTemplate = `
    <div class="actions-empty">
        <p>Выберите карту, чтобы увидеть действия</p>
    </div>
`

export const SelectedCardTemplate = (el) => {
    return `
        <div class="actions">
            <div class="actions-header">
                <img src="${ el.src?.bg || el.src?.[0] }" alt="">
                <p>Выбрана 1 карта - ${ el.element.id() }</p>
            </div>
            
            <div class="actions-menu">
                ${ 
            
                    el.options.map(option => (`
                    
                        <div class="action-menu-item" data-type="${ option.method }">
                            <div class="icon" title="${option.name}">
                                <img src="/actions/${option.method}.svg" alt="">
                            </div>
                        </div>
                        
                    `)).join("")
                            
                }
                
            </div>
        </div>
    `
}

export const SelectedGroupCardTemplate = (count) => {
    if ( !count ) {
        return EmptyActionsTemplate;
    }

    return `
        
        <div class="actions">
            <div class="actions-header">
                <img src="/actions/roll.svg" alt="">
                <p>В руках ${ count } карт</p>
            </div>
            
            <div class="actions-menu">
                
                    <div class="action-menu-item group-item" data-type="shuffle">
                        <div class="icon" title="Перемешать">
                            <img src="/actions/shuffle.svg" alt="">
                        </div>
                    </div>
                                        
            </div>
        </div>
    
    `
}
