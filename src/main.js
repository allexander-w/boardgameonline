import './style.css';
import "./cursor";
import BeginScreen from "./screens/begin";
import Preloader from "./screens/preloader";

import config from "./config";
import { usersManager } from "./core";
import { resolveRoomId } from "./core/room";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const roomId = resolveRoomId();
const roomCodeNode = document.querySelector(".room-code");
if ( roomCodeNode ) {
    roomCodeNode.textContent = "ROOM #" + roomId;
}

const beginScreen = BeginScreen.init();
beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();
    usersManager.register({ name, avatar: randomInteger(1, 10), room: roomId });

    Preloader.init();

    const result = import ("./games/" + config.scene);
    const scene = await result;

    const UndefinedScene = scene.default;
    new UndefinedScene();
})