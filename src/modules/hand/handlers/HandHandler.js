class HandHandler {
    constructor( handManager, layerManager, emitter) {
        this.handManager = handManager;
        this.layerManager = layerManager;
        this.emitter = emitter;
        this.board = this.layerManager.getLayer("board");
        this.stage = this.layerManager.stage;

        this.emitter.on("modules.hand.takeHalf", this.handManager.remoteTakeHalf.bind(this.handManager));
        this.emitter.on("modules.hand.take", this.handManager.remoteTake.bind(this.handManager));
        this.emitter.on("modules.hand.put", this.handManager.remotePut.bind(this.handManager));
        this.emitter.on("modules.hand.takeAll", this.handManager.remoteTakeAll.bind(this.handManager));
        this.emitter.on("modules.hand.putById", this.handManager.remotePutById.bind(this.handManager));
        this.emitter.on("modules.hand.released", this.handManager.remoteReleased.bind(this.handManager));

        this.emitter.on("intersection.bottom", this.handManager.take.bind(this.handManager));

        this.board.on("click", this.validateEntityType.bind(this));
        this.stage.on("click", this.validatePutEvent.bind(this));
        document.addEventListener('keyup', this.keyboardListener.bind(this));

        const pane = document.querySelector(".bottom-pane");
        const stackPane = document.querySelector(".stack-panel");

        pane.addEventListener('dblclick', this.card.bind(this));
        stackPane.addEventListener("click", this.stackControl.bind(this));


        pane.addEventListener('dragstart', (e) => {
            const card = e.target.closest('.playing-card');
            if ( card ) {
                card.style.opacity = '0.3';

                const img = card.querySelector('img');
                e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
                e.dataTransfer.setData('text/plain', card.dataset.id);

                document.querySelector(".bottom-pane").classList.add("drag");
            }
        });

        pane.addEventListener('dragend', (e) => {
            const card = e.target.closest('.playing-card');
            if (card) card.style.opacity = '1';
        });

        document.body.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.body.addEventListener('drop', (e) => {
            e.preventDefault();
            document.querySelector(".bottom-pane").classList.remove("drag");
            if ( e.target.localName !== 'canvas' ) return false;

            const cardId = e.dataTransfer.getData('text/plain');
            this.handManager.putById(cardId, e);
        });
    }

    card(e) {
        console.log(e.target)
    }

    stackControl(e) {
        const parent = e.target.closest(".tab-btn");
        if ( !parent ) return false;

        if ( parent.dataset.id ) {
            this.handManager.selectStack(parent.dataset.id);
        }
        if ( parent.dataset.action ) {
            this.handManager.addStack();
        }
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