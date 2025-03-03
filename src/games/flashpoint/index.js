import GeneralScene from "../../scenes/general";
import Camera from "../../core/camera";
import FlashpointHeaps from "./entities/heaps";
import heapsConfig from "./config/index";


function FlashpointScene() {
    GeneralScene.apply(this, [...arguments, { dice: true }]);

    /* Загрузка игрового поля */
    this.loadGameField("/entities/field.png", { width: 2308, height: 1632 })
        .then(() => new Camera(this.board));

    /* Иинициализация всех куч элементов */
    new FlashpointHeaps(this.board, heapsConfig);

    this.initialize();
}

export default FlashpointScene;
