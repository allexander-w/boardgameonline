import GeneralScene from "../general";
import Camera from "../../core/camera";
import JackalHeaps from "../../entities/heaps/jackal";
import Konva from "konva";


function JackalScene() {
    GeneralScene.apply(this);

    this.field_layer = new Konva.Layer();


    /* Иинициализация всех куч элементов */
    new JackalHeaps(this.game_layer, this.board, this.field_layer)
    new Camera(this.board.stage, this.game_layer);


    this.board.add_layer('field', this.field_layer);
    this.initialize();

}

export default JackalScene;
