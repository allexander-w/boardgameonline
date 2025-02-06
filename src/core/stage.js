import Konva from "konva";
import Camera from "./camera";

function Board() {
    this.stage = new Konva.Stage({
        container: "app",
        width: window.innerWidth,
        height: window.innerHeight
    });


    /* Иинициализация камеры */
    new Camera(this.stage);


    /* Стейт */
    this.layers = new Map();


    /* Методы */
    this.add_layer = (key, layer) => {
        this.layers.set(key, layer);
        this.stage.add(layer);
    }

    this.get_layer = (key) => {
        return this.layers.get(key);
    }

}

export default Board;