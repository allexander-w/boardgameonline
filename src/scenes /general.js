import Konva from "konva";
import Board from "../core/stage.js";
import Heaps from "../core/heaps";
import { gameField } from "../factory/field.factory";

export default function GeneralScene() {
    this.board = new Board();
    this.game_layer = new Konva.Layer();

    new Heaps(this.game_layer, this.board.stage);

    /* Загрузка игрового поля */
    gameField.then(field => this.game_layer.add(field));

    /* Отрисовка сцены */
    this.board.add_layer('board', this.game_layer);
    this.game_layer.draw();
}