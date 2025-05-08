import {cardsManager, layersManager} from "../../core";
import UIManager from "./managers/UIManager";
import InterfaceModule from "./InterfaceModule";

export default {
    module: null,
    init() {
        const uiInterface = new InterfaceModule(UIManager);

        console.log("interface module initialized");
        this.module = uiInterface;
    }
};