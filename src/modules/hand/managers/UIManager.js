import { CardsPane, StacksPane } from "../templates/card.template";
import { FanController } from "./Fan";

class UIManager {
    constructor() {
        this.fanController = null;
    }

    renderCards(cards, kit) {
        console.log(cards, kit);

        const pane = document.querySelector(".bottom-pane__wrapper");
        const stacks = document.querySelector(".stack-panel");

        // Убиваем прошлый контроллер, чтобы не копились обработчики событий
        if (this.fanController) {
            this.fanController.destroy();
            this.fanController = null;
        }

        pane.innerHTML = "";
        stacks.innerHTML = "";

        /* cardsManager - чтобы смотреть сразу 2 стороны карты */
        pane.insertAdjacentHTML("afterbegin", CardsPane(cards));
        stacks.insertAdjacentHTML("afterbegin", StacksPane(kit));

        // Инициализируем веер после вставки DOM
        const fanContainer = pane.querySelector(".fan-container");
        if (fanContainer && cards && cards.length > 0) {
            this.fanController = new FanController(fanContainer);
        }
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