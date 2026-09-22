function generateRoomId() {
    return Math.random().toString(36).slice(2, 8);
}

function resolveRoomId() {
    const url = new URL(window.location.href);
    let room = url.searchParams.get("room");

    if ( !room ) {
        room = generateRoomId();
        url.searchParams.set("room", room);
        window.history.replaceState(null, "", url);
    }

    return room;
}

export { resolveRoomId };