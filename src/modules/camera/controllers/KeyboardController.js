class KeyboardController {
    constructor(camera) {
        this.camera = camera;
        this.keys = { W: false, S: false, A: false, D: false };
        this.intervalMoving = null;
    }

    setupKeyboardListeners() {
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        if (this.keys.hasOwnProperty(event.code.replace("Key", ""))) {
            this.keys[event.code.replace("Key", "")] = true;
            if (!this.intervalMoving) {
                this.intervalMoving = setInterval(() => this.moveCamera(), 10);
            }
        }
    }

    handleKeyUp(event) {
        if (this.keys.hasOwnProperty(event.code.replace("Key", ""))) {
            this.keys[event.code.replace("Key", "")] = false;
            if (this.intervalMoving && Object.values(this.keys).every(v => !v)) {
                clearInterval(this.intervalMoving);
                this.intervalMoving = null;
            }
        }
    }

    moveCamera() {
        const d = 15;
        const dx = this.keys.A ? d : this.keys.D ? -d : 0;
        const dy = this.keys.W ? d : this.keys.S ? -d : 0;
        this.camera.move(dx, dy);
    }
}

export default KeyboardController;