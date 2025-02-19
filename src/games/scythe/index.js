import Camera from "../../core/camera";
import GeneralScene from "../../scenes/general";
import ScytheHeaps from "./entities/heaps";
import heapsConfig from "./config/index";

function ScytheScene(user, preload) {
    GeneralScene.apply(this, [...arguments, { layers: ["fixed"] }]);

    /* Загрузка игрового поля */
    this.loadGameField("/scythe/field.png", { width: 1902, height: 1474, opacity: 0.8 })
        .then(() => new Camera(this.board));

    /* Иинициализация всех куч элементов */
    new ScytheHeaps(this.board, heapsConfig);

    this.initialize();
}

export default ScytheScene;
