const CardTemplate = (card) => {
    return `
        <div class="playing-card" data-id="${ card.id() }">
            <img draggable="true" src="${ card.attrs.fillPatternImage?.currentSrc }" alt="">
        </div>
    `
}

const StackTemplate = (id, stack) => {
    return `
        <button class="tab-btn ${ stack.active ? 'active' : '' }" data-id="${ id }">${ id.slice(0,3) } - ${ stack.stack.size }</button>
    `
}

export const CardsPane = (cards) => {
    return `
        <div class="scrollable">
            ${ cards.map(card => CardTemplate(card)).join("") }
        </div>
    `
}

export const StacksPane = (stacks) => {
    return `
        ${ stacks.map(stack => StackTemplate(stack[0], stack[1])).join("") }
        <button class="tab-btn" data-action="plus">+</button>
    `
}