class LayersManager {
    constructor(CanvasAdapter) {
        this.CanvasAdapter = CanvasAdapter;

        this.generalStage = new CanvasAdapter.Stage({
            container: "app",
            width: window.innerWidth,
            height: window.innerHeight
        })

        this.layers = new Map();
    }

    get stage() {
        return this.generalStage;
    }

    registerLayer = (key) => {
        const layer = new this.CanvasAdapter.Layer();
        this.layers.set(key, layer);
        this.generalStage.add(layer);

        this.getLayer("board")?.moveToTop();
        this.getLayer("cursors")?.moveToTop();
    }

    getLayer = (key) => {
        return this.layers.get(key);
    }
}

export default LayersManager;