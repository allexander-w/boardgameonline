import Konva from "konva";
import Board from "../core/stage.js";
import Camera from "../core/camera.js";

export default function GeneralScene() {
    this.board = new Board();
    this.game_layer = new Konva.Layer();


    const bg_board = new Konva.Rect({
        width: 1000,
        height: 1000,
        fill: "#d4e157",
        listening: false
    });

    this.game_layer.add(bg_board);


    this.board.add_layer('board', this.game_layer);
    this.game_layer.draw();

    const board_stage = this.board.stage;

    board_stage.on('wheel', (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.05;
        const oldScale = board_stage.scaleX();

        // Определяем новый масштаб
        const pointer = board_stage.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - board_stage.x()) / oldScale,
            y: (pointer.y - board_stage.y()) / oldScale,
        };

        const newScale =
            e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        board_stage.scale({ x: newScale, y: newScale });

        // Обновляем позицию, чтобы зум происходил относительно указателя мыши
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        board_stage.position(newPos);
        board_stage.batchDraw();
    });



    board_stage.on('mousedown', () => {
        board_stage.draggable(true);
    });

    board_stage.on('mouseup', () => {
        board_stage.draggable(false);
    });

}