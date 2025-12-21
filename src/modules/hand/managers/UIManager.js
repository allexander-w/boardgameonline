import {CardsPane, StacksPane} from "../templates/card.template";
import {cardsManager} from "../../../core";

class UIManager {
    constructor() {

    }

    renderCards(cards, kit) {
        console.log(cards, kit);



        const pane = document.querySelector(".bottom-pane__wrapper");
        const stacks = document.querySelector(".stack-panel");
        pane.innerHTML = "";
        stacks.innerHTML = ""

        /* cardsManager - чтобы смотреть сразу 2 стороны карты */
        pane.insertAdjacentHTML("afterbegin", CardsPane(cards));
        stacks.insertAdjacentHTML("afterbegin", StacksPane(kit));
    }

    renderAddInfo() {
        const pane = document.querySelector(".bottom-pane__wrapper");
        pane.classList.add("active");
    }

    clearAddInfo() {
        const pane = document.querySelector(".bottom-pane__wrapper");
        pane.classList.remove("active");
    }
}

export default UIManager;