export const EmptyActionsTemplate = `
   
`

export const SelectedCardTemplate = (el) => {
    return `
            ${ 
        
                el?.options && el.options.map(option => (`
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

/* Выбрана стопка: n из total (колесико мыши меняет n), действия над n верхними картами */
export const SelectedStackTemplate = (total, limit) => {
    if ( !total || total < 2 ) {
        return EmptyActionsTemplate;
    }

    return `
        <button title="Сколько карт брать сверху (колесико мыши)" class="tool-btn action-tool group-item stack-limit"><span>${ limit }/${ total }</span></button>
        <button title="Перевернуть ${ limit } карт" data-type="flipStack" class="tool-btn action-tool group-item"><i class="ph ph-device-rotate"></i></button>
        <button title="Повернуть ${ limit } карт влево" data-type="rotateStackLeft" class="tool-btn action-tool group-item"><i class="ph ph-arrow-counter-clockwise"></i></button>
        <button title="Повернуть ${ limit } карт вправо" data-type="rotateStackRight" class="tool-btn action-tool group-item"><i class="ph ph-arrow-clockwise"></i></button>
        <button title="Перемешать" data-type="shuffle" class="tool-btn action-tool group-item"><i class="ph ph-shuffle"></i></button>
    `
}
