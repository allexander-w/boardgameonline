import GeneralScene from "../../scenes/general";
import Camera from "../../core/camera";
import EvolutionHeaps from "./entities/heaps";
import heapsConfig from "./config/index";


function EvolutionScene() {
    GeneralScene.apply(this, arguments);

    /* Иинициализация всех куч элементов */
    new EvolutionHeaps(this.board, heapsConfig);

    this.initialize();

    new Camera(this.board);
}

export default EvolutionScene;
