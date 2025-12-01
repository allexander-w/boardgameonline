class HandHandler {
    constructor( handManager, layerManager, emitter) {
        this.handManager = handManager;
        this.layerManager = layerManager;
        this.emitter = emitter;
        this.board = this.layerManager.getLayer("board");
        this.stage = this.layerManager.stage;


        // this.emitter.on("intersection.bottom.move", (s) => console.log('test'));

        this.emitter.on("modules.hand.takeHalf", this.handManager.remoteTakeHalf.bind(this.handManager));
        this.emitter.on("modules.hand.take", this.handManager.remoteTake.bind(this.handManager));
        this.emitter.on("modules.hand.put", this.handManager.remotePut.bind(this.handManager));
        this.emitter.on("modules.hand.takeAll", this.handManager.remoteTakeAll.bind(this.handManager));

        this.emitter.on("intersection.bottom", this.handManager.take.bind(this.handManager));

        this.board.on("click", this.validateEntityType.bind(this));
        this.stage.on("click", this.validatePutEvent.bind(this));
        document.addEventListener('keyup', this.keyboardListener.bind(this));
    }

    validateEntityType(e) {
        if ( e.target ) {
            if (e.evt.shiftKey && (e.evt.ctrlKey || e.evt.metaKey)) {
                this.handManager.takeAll(e.target);
                return false;
            }

            if (e.evt.shiftKey) {
                this.handManager.takeHalf(e.target);
                return false;
            }

            if (e.evt.ctrlKey || e.evt.metaKey) {
                this.handManager.take(e.target);
                return false;
            }
        }
    }

    validatePutEvent(e) {
        if (e.evt.altKey) {
            this.handManager.put();
        }
    }

    keyboardListener(e) {
        if ( e.code === 'KeyM' ) {
            this.handManager.shuffle();
        }
    }
}

export default HandHandler;