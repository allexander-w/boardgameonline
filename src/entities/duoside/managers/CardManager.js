class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.uiManager.createSideImages(this.element, src);
    }

    flipBack() {
        this.uiManager.setBackImage(this.element);
        this.element.flipped(false);
    }

    flipFront() {
        this.uiManager.setFrontImage(this.element);
        this.element.flipped(true);
    }

    /* Поворот карточки */
    flip() {
        const animation = this.uiManager.getFlipAnimation(this.element, () => {
            this.element.flipped() ? this.flipBack() : this.flipFront();
        })

        animation.play();
    }

    rotateRight() {
        const rotationDeg = this.element.rotation() === 360 ? 90 : this.element.rotation() + 90;
        this.uiManager.setRotateDeg(this.element, rotationDeg);
    }

    rotateLeft() {
        const rotationDeg = this.element.rotation() === 0 ? -90 : this.element.rotation() - 90;
        this.uiManager.setRotateDeg(this.element, rotationDeg);
    }
}

export default CardManager;