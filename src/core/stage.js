import Konva from "konva";


function Board() {
    this.stage = new Konva.Stage({
        container: "app",
        width: window.innerWidth,
        height: window.innerHeight
    });

    this.layers = new Map();

    this.add_layer = (key, layer) => {
        this.layers.set(key, layer);
        this.stage.add(layer);
    }

    this.get_layer = (key) => {
        return this.layers.get(key);
    }
}

export default Board;