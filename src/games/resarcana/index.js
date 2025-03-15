import GeneralScene from "../../scenes/general";
import Camera from "../../core/camera";
import ArcanaHeaps from "./entities/heaps";
import heapsConfig from "./config/index";

function ArcanaScene() {
    GeneralScene.apply(this, arguments);

    /* Иинициализация всех куч элементов */
    new ArcanaHeaps(this.board, heapsConfig);

    this.initialize();

    new Camera(this.board);
}

export default ArcanaScene;
