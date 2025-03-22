import './style.css';
import BeginScreen from "./entities/screens/begin.screen";
// import PreloaderScreen from "./entities/screens/preloader.screen";
import Preloader from "./screens/preloader";

import config from "./config";
import { usersManager } from "./core";

const beginScreen = new BeginScreen();
beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();
    usersManager.register({ name });

    Preloader.init();

    const result = import ("./games/" + config.scene);
    const scene = await result;

    const UndefinedScene = scene.default;
    new UndefinedScene();
})