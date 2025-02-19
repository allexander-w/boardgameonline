import GeneralScene from "../../scenes/general";
import Camera from "../../core/camera";
import VineHeaps from "./entities/heaps";
import heapsConfig from "./config/index";

function VineScene() {
    GeneralScene.apply(this, [...arguments, { layers: ['fixed'] }]);

    /* Загрузка игрового поля */
    this.loadGameField("/vine/field.jpg", { width: 3012, height: 2422 })
        .then(() => new Camera(this.board));

    /* Иинициализация всех куч элементов */
    new VineHeaps(this.board, heapsConfig);

    this.initialize();
}

export default VineScene;
