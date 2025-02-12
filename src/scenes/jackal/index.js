import GeneralScene from "../general";
import Camera from "../../core/camera";
import JackalHeaps from "../../entities/heaps/jackal";


function JackalScene() {
    GeneralScene.apply(this);

    /* Иинициализация всех куч элементов */
    new JackalHeaps(this.game_layer, this.board.stage)
    new Camera(this.board.stage, this.game_layer);

    this.initialize();
}

export default JackalScene;
