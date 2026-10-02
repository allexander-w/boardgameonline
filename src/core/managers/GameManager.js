class GameManager {
    constructor() {
        this.game = null;
        this.cameraViews = [];
    }

    set(game) {
        this.game = game;
    }

    get() {
        return this.game;
    }

    getId() {
        return this.game?.id;
    }

    getName() {
        return this.game?.name;
    }

    setCameraViews(views) {
        this.cameraViews = views || [];
    }
}

export default GameManager;