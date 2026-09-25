function generateRoomId() {
    return Math.random().toString(36).slice(2, 8);
}

function getRoomFromUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get("room");
}

function setRoomId(room) {
    const url = new URL(window.location.href);
    url.searchParams.set("room", room);
    window.history.replaceState(null, "", url);
}

function resolveRoomId() {
    let room = getRoomFromUrl();

    if ( !room ) {
        room = generateRoomId();
        setRoomId(room);
    }

    return room;
}

function getGameFromUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get("game");
}

function setGameId(game) {
    const url = new URL(window.location.href);
    url.searchParams.set("game", game);
    window.history.replaceState(null, "", url);
}

async function fetchRoomList(wsUrl) {
    try {
        const httpUrl = wsUrl.replace(/^ws/, "http") + "/rooms";
        const response = await fetch(httpUrl);
        if ( !response.ok ) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
}

async function fetchRoom(wsUrl, roomId) {
    try {
        const httpUrl = wsUrl.replace(/^ws/, "http") + "/room/" + encodeURIComponent(roomId);
        const response = await fetch(httpUrl);
        if ( !response.ok ) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

export { resolveRoomId, getRoomFromUrl, setRoomId, generateRoomId, fetchRoomList, fetchRoom, getGameFromUrl, setGameId };