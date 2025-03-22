class PreloadHandler {
    constructor(emitter, preloadManager) {
        this.emitter = emitter;
        this.preloadManager = preloadManager;

        this.emitter.on("screen.preloader.loading", this.preloadManager.loading.bind(preloadManager));
        this.emitter.on("screen.preloader.loaded", this.preloadManager.loaded.bind(preloadManager));
    }
}

export default PreloadHandler;