export const EmptyActionsTemplate = `
   
`

export const SelectedCardTemplate = (el) => {
    return `
            ${ 
        
                el.options.map(option => (`
                    <button title="${option.name}" data-type="${ option.method }" class="tool-btn action-tool"><i class="ph ph-${ option.icon }"></i></button>
                `)).join("")
                        
            }
    `
}

export const SelectedGroupCardTemplate = (count) => {
    if ( !count ) {
        return EmptyActionsTemplate;
    }

    return `

        <button title="Количество карт в руках" class="tool-btn action-tool group-item"><span>${ count }</span></button>
        <button title="Перемешать" data-type="shuffle" class="tool-btn action-tool group-item"><i class="ph ph-shuffle"></i></button>

    `
}
