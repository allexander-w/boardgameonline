import './style.css';
import "./cursor";
import BeginScreen from "./screens/begin";
import Preloader from "./screens/preloader";

import config from "./config";
import { usersManager, gameManager } from "./core";
import { getRoomFromUrl, setRoomId, generateRoomId, fetchRoomList, fetchRoom } from "./core/room";
import gamesRegistry from "./games/registry";

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

function lockToGame(gameId) {
    const game = gamesRegistry.find(game => game.id === gameId);
    gameManager.set(game);

    beginScreen.lockGame(game.name);
    beginScreen.setBackground(config.s3BaseUrl("/" + gameId + "/bg.png"));
}

function unlockGame() {
    beginScreen.renderGames(gamesRegistry, gameManager.getId(), (id) => {
        const game = gamesRegistry.find(game => game.id === id);
        gameManager.set(game);

        beginScreen.setBackground(config.s3BaseUrl("/" + game.id + "/bg.png"));
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


const gameModules = import.meta.glob("./games/**/index.js", {
    eager: false
});

beginScreen.emitter.on("sign", async (name) => {
    beginScreen.off();

    if ( !roomId ) {
        roomId = generateRoomId();
        setRoomId(roomId);
        updateRoomCode();
    }

    usersManager.register({ name, avatar: randomInteger(1, 10), room: roomId, game: gameManager.getId() });
    Preloader.init();

    const path = `./games/${gameManager.getId()}/index.js`;
    const loader = gameModules[path];

    if (!loader) {
        throw new Error(`Game module not found: ${path}`);
    }

    const scene = await loader();

    const UndefinedScene = scene.default;
    new UndefinedScene();
})