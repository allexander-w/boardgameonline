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
            this.preloadScreen.off();
            this.emitter.off("screen.preloader.loading");
            this.emitter.off("screen.preloader.loaded");
        }
    }
}

export default PreloadManager;