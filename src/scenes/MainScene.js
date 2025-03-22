class MainScene {
    constructor(layerManager, layers, preloader) {
        /* Менеджер слоев */
        this.layerManager = layerManager;

        /* Добавление кастомных слоев */
        this.customLayersInitialization(layers);

        /* Получение слоя */
        this.boardLayer = this.layerManager.getLayer('board');
    }

    customLayersInitialization(layers) {
        if ( layers?.length ) {
            for ( const l of layers ) {
                this.layerManager.registerLayer(l);
            }
        }
    }
}

export default MainScene;