import './style.css';
import "./cursor";
import BeginScreen from "./screens/begin";
import Preloader from "./screens/preloader";

import config from "./config";
import { usersManager } from "./core";
import { getRoomFromUrl, setRoomId, generateRoomId, fetchRoomList } from "./core/room";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

let roomId = getRoomFromUrl();
const roomCodeNode = document.querySelector(".room-code");

function updateRoomCode() {
    if ( roomCodeNode && roomId ) roomCodeNode.textContent = "ROOM #" + roomId;
}

updateRoomCode();

const beginScreen = BeginScreen.init();

if ( !roomId ) {
    fetchRoomList(config.ws).then(rooms => {
        beginScreen.renderRooms(rooms, (id) => {
            roomId = id || generateRoomId();
            setRoomId(roomId);
            updateRoomCode();
        });
    });
}

beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();

    if ( !roomId ) {
        roomId = generateRoomId();
        setRoomId(roomId);
        updateRoomCode();
    }

    usersManager.register({ name, avatar: randomInteger(1, 10), room: roomId });

    Preloader.init();

    const result = import ("./games/" + config.scene);
    const scene = await result;

    const UndefinedScene = scene.default;
    new UndefinedScene();
})