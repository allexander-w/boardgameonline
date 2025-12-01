import {CardsPane} from "../templates/card.template";

class UIManager {
    constructor() {

    }

    renderCards(cards) {
        console.log(cards)

        const pane = document.querySelector(".bottom-pane");
        pane.innerHTML = "";

        pane.insertAdjacentHTML("afterbegin", CardsPane(cards));
    }

    renderAddInfo() {
        const pane = document.querySelector(".bottom-pane");
        pane.classList.add("active");
    }

    clearAddInfo() {
        const pane = document.querySelector(".bottom-pane");
        pane.classList.remove("active");
    }
}

export default UIManager;