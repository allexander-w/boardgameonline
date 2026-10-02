const COLORS = ["orange", "red", "coral", "gold", "white"];

export default function userColor(id) {
    const str = String(id);
    let hash = 0;

    for ( let i = 0; i < str.length; i++ ) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }

    return COLORS[hash % COLORS.length];
}