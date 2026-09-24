import './style.css';
import "./cursor";
import BeginScreen from "./screens/begin";
import Preloader from "./screens/preloader";

import config from "./config";
import { usersManager } from "./core";
import { getRoomFromUrl, setRoomId, generateRoomId, fetchRoomList, fetchRoom, getGameFromUrl, setGameId } from "./core/room";
import gamesRegistry from "./games/registry";

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function gameName(id) {
    return gamesRegistry.find(g => g.id === id)?.name || id;
}

let roomId = getRoomFromUrl();
let selectedScene = getGameFromUrl() || config.scene;

const roomCodeNode = document.querySelector(".room-code");

function updateRoomCode() {
    if ( roomCodeNode && roomId ) roomCodeNode.textContent = "ROOM #" + roomId;
}

updateRoomCode();

const beginScreen = BeginScreen.init();

function lockToGame(gameId) {
    selectedScene = gameId;
    beginScreen.lockGame(gameName(gameId));
    beginScreen.setBackground("/" + gameId + "/bg.png");
}

function unlockGame() {
    beginScreen.renderGames(gamesRegistry, selectedScene, (id) => {
        selectedScene = id;
        beginScreen.setBackground("/" + selectedScene + "/bg.png");
    });
}

if ( roomId ) {
    fetchRoom(config.ws, roomId).then(room => {
        if ( room && room.game ) lockToGame(room.game);
        else unlockGame();
    });
} else {
    unlockGame();

    fetchRoomList(config.ws).then(rooms => {
        beginScreen.renderRooms(rooms, (id) => {
            roomId = id || generateRoomId();
            setRoomId(roomId);
            updateRoomCode();

            const picked = id && rooms.find(r => r.id === id);
            if ( picked?.game ) lockToGame(picked.game);
            else unlockGame();
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

    usersManager.register({ name, avatar: randomInteger(1, 10), room: roomId, game: selectedScene });

    Preloader.init();

    const result = import ("./games/" + selectedScene);
    const scene = await result;

    const UndefinedScene = scene.default;
    new UndefinedScene();
})