class CounterHandler {
    constructor(counterManager) {
        this.counterManager = counterManager;
        const group = this.counterManager.element;

        const btnDec = group.findOne(".btnDecrement");
        const btnInc = group.findOne(".btnIncrement");

        // Обработка клика по кнопке Уменьшить (<)
        if (btnDec) {
            btnDec.on("click tap", (e) => {
                e.cancelBubble = true; // Отменяем всплытие, чтобы не провоцировать лишние события
                this.counterManager.decrement();
            });
            btnDec.on("mouseenter", () => (group.getStage().container().style.cursor = "pointer"));
            btnDec.on("mouseleave", () => (group.getStage().container().style.cursor = "default"));
        }

        // Обработка клика по кнопке Увеличить (>)
        if (btnInc) {
            btnInc.on("click tap", (e) => {
                e.cancelBubble = true;
                this.counterManager.increment();
            });
            btnInc.on("mouseenter", () => (group.getStage().container().style.cursor = "pointer"));
            btnInc.on("mouseleave", () => (group.getStage().container().style.cursor = "default"));
        }
    }
}

export default CounterHandler;