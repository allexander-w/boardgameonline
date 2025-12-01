const CardTemplate = (card) => {
    return `
        <div class="playing-card" data-id="${ card.id() }">
            <img src="${ card.attrs.fillPatternImage?.currentSrc }" alt="">
        </div>
    `
}

export const CardsPane = (cards) => {
    return `
        <div class="scrollable">
            ${ cards.map(card => CardTemplate(card)).join("") }
        </div>
    `
}