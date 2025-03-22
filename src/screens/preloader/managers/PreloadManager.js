class PreloadManager {
    constructor(emitter, ws, preloadScreen) {
        this.countForLoading = 0;
        this.countLoaded = 0;
        this.emitter = emitter;

        this.ws = ws;
        this.preloadScreen = preloadScreen;
    }


    loading() {
        this.countForLoading ++;
    }

    loaded(src) {
        this.countLoaded ++;
        this.preloadScreen.update(src);

        if (this.countLoaded === this.countForLoading) {
            this.ws.connect();
            this.preloadScreen.off();
            this.emitter.off("loaded");
            this.emitter.off("synced");
        }
    }
}

export default PreloadManager;