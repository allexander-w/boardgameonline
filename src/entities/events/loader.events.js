import ws from "../../core/websocket";

function PreloadEvents(preload) {
    this.countForLoading = 0;
    this.counter = 0;

    ws.emitter.on("loading", (src) => {
        this.countForLoading ++;
    })

    ws.emitter.on("loaded", (src) => {
        this.counter ++;
        preload.update(src);

        if (this.counter === this.countForLoading) {
            ws.initializationWebsockets();
        }
    })

    ws.emitter.on("synced", () => {
        preload.off();
        ws.emitter.off("loaded");
        ws.emitter.off("synced");
    })
}

export default PreloadEvents;