const fs = require('fs');
const initSqlJs = require('sql.js');
const path = require('path');

const dbPath = path.join(__dirname, "../catatan.db");
let db;

async function initDatabase() {
    const SQL = await initSqlJs();
    if(fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
        console.log("Berhasil memuat database lama.");
    } else {
        db = new SQL.Database();
        db.run(`CREATE TABLE IF NOT EXISTS tugas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            waktu TEXT,
            isi TEXT
            )`);
            console.log("Database baru dibuat.");
    }
    return db;
}

function saveDatabase() {
    if(!db) return;
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
}

module.exports = { initDatabase, saveDatabase, getDb: () => db};