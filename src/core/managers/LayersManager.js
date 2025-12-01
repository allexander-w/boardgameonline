class LayersManager {
    constructor(CanvasAdapter) {
        this.CanvasAdapter = CanvasAdapter;

        this.generalStage = new CanvasAdapter.Stage({
            container: "app",
            width: window.innerWidth,
            height: window.innerHeight,
        })

        this.layers = new Map();
        this.groups = new Map();
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

    registerGroup = (key, layer, coordinates) => {
        const gr = new this.CanvasAdapter.Group({ ...coordinates });
        this.groups.set(key, gr);
        layer.add(gr);
    }

    getLayer = (key) => {
        return this.layers.get(key);
    }

    getGroup = (key) => {
        return this.groups.get(key);
    }

    clearCacheAllGroups = () => {
        for (const [key, value] of this.groups) {
            value.clearCache();
        }

        this.generalStage.batchDraw();
    }

    cacheAllGroups = (duration = 0) => {
        setTimeout(() => {
            for (const [key, value] of this.groups) {
                value.cache({ pixelRatio: 2 });
            }
        }, duration)

        this.generalStage.batchDraw();
    }
}

export default LayersManager;