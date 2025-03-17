import GeneralScene from "../../scenes/general";
import Camera from "../../core/camera";
import PaleoHeaps from "./entities/heaps";
import heapsConfig from "./config/index";

function PaleoScene() {
    GeneralScene.apply(this, [...arguments, { layers: ['fixed'] }]);

    /* Иинициализация всех куч элементов */
    new PaleoHeaps(this.board, heapsConfig);

    this.initialize();

    new Camera(this.board);
}

export default PaleoScene;
