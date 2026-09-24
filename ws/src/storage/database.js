const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");

const dbPath = process.env.DB_PATH || path.join(__dirname, "../../data/rooms.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
                                         id TEXT PRIMARY KEY,
                                         name TEXT NOT NULL,
                                         game TEXT,
                                         state TEXT NOT NULL,
                                         created_at INTEGER NOT NULL,
                                         updated_at INTEGER NOT NULL
    )
`);

function createRoom(id, name, game) {
    const now = Date.now();
    const emptyState = JSON.stringify({ elements: [], resources: [] });

    db.prepare(`
        INSERT OR IGNORE INTO rooms (id, name, game, state, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name || id, game || null, emptyState, now, now);
}

function getRoom(id) {
    const row = db.prepare("SELECT * FROM rooms WHERE id = ?").get(id);
    if ( !row ) return null;

    return {
        id: row.id,
        name: row.name,
        game: row.game,
        state: JSON.parse(row.state),
        updatedAt: row.updated_at,
    };
}

function saveRoom(id, name, game, state) {
    const now = Date.now();

    db.prepare(`
        INSERT INTO rooms (id, name, game, state, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name, game = excluded.game, state = excluded.state, updated_at = excluded.updated_at
    `).run(id, name || id, game || null, JSON.stringify(state), now, now);
}

function listRooms(limit = 50) {
    return db.prepare(`
        SELECT id, name, game, updated_at as updatedAt FROM rooms
        ORDER BY updated_at DESC
            LIMIT ?
    `).all(limit);
}

module.exports = { createRoom, getRoom, saveRoom, listRooms };