import './style.css';
import "./cursor";
import BeginScreen from "./screens/begin";
import Preloader from "./screens/preloader";

import config from "./config";
import { usersManager } from "./core";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const beginScreen = BeginScreen.init();
beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();
    usersManager.register({ name, avatar: randomInteger(1, 10) });

    Preloader.init();

    const result = import ("./games/" + config.scene);
    const scene = await result;

    const UndefinedScene = scene.default;
    new UndefinedScene();
})