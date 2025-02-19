import Konva from "konva";

function Board() {
    this.stage = new Konva.Stage({
        container: "app",
        width: window.innerWidth,
        height: window.innerHeight
    });

    /* Стейт */
    this.layers = new Map();


    /* Методы */
    this.add_layer = (key) => {
        const layer = new Konva.Layer();
        this.layers.set(key, layer);
        this.stage.add(layer);
    }

    this.get_layer = (key) => {
        return this.layers.get(key);
    }
}

export default Board;