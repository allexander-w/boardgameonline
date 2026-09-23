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

export { resolveRoomId, getRoomFromUrl, setRoomId, generateRoomId, fetchRoomList };