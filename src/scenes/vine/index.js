import GeneralScene from "../general";
import {gameField} from "../../factory/vine/field.factory";
import Camera from "../../core/camera";
import VineHeaps from "../../entities/heaps/vine";

function VineScene(user) {
    GeneralScene.apply(this, arguments);

    /* Загрузка игрового поля */
    gameField.then(field => setTimeout(() => {
        this.game_layer.add(field);
        field.moveToBottom();

        /* Иинициализация камеры */
        new Camera(this.board.stage, this.game_layer);
    }, 0));


    /* Иинициализация всех куч элементов */
    new VineHeaps(this.game_layer, this.board);
    this.initialize();
}

export default VineScene;
