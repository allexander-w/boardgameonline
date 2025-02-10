import GeneralScene from "../general";
import {gameField} from "../../factory/field.factory";
import Camera from "../../core/camera";

function FlashPointScene() {
    GeneralScene.apply(this);

    /* Загрузка игрового поля */
    gameField.then(field => setTimeout(() => {
        this.game_layer.add(field);
        field.moveToBottom();

        /* Иинициализация камеры */
        new Camera(this.board.stage, this.game_layer);
    }, 1000));
}

export default FlashPointScene;
