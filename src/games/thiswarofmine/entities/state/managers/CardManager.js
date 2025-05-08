class CardManager {
    constructor(src, options, uiManager) {
        this.uiManager = uiManager;
        this.images = [];

        /* Создание элемента */
        this.element = this.uiManager.createElement(options);
        this.loadImages(src);

        this.index = src.length - 1;
    }

    async loadImages(src) {
        for ( const img of src ) {
            const image = await this.uiManager.createSideImages(this.element, img);
            this.images.push(image);
        }
    }

    change() {
        this.index = this.index >= (this.images.length - 1) ? 0 : this.index + 1;
        this.uiManager.changeImage(this.element, this.images[this.index]);
    }

}

export default CardManager;