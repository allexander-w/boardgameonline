class GameManager {
    constructor() {
        this.game = null;
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
}

export default GameManager;