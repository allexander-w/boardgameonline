import GeneralScene from "../../scenes/general";
import Camera from "../../core/camera";
import SplendorHeaps from "./entities/heaps";
import heapsConfig from "./config/index";


function SplendorScene() {
    GeneralScene.apply(this, arguments);

    /* Иинициализация всех куч элементов */
    new SplendorHeaps(this.board, heapsConfig);

    this.initialize();

    new Camera(this.board);
}

export default SplendorScene;
