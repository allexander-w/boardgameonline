import Konva from "konva";
import Board from "../core/stage.js";
import Heaps from "../core/heaps";

export default function GeneralScene() {
    this.board = new Board();
    this.game_layer = new Konva.Layer();

    /* Иинициализация всех куч элементов */
    new Heaps(this.game_layer, this.board.stage);

    /* Отрисовка сцены */
    this.board.add_layer('board', this.game_layer);
    this.game_layer.draw();
}