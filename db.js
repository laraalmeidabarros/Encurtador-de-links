const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'links.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
`);

module.exports = {
  create: (code, url) =>
    db.prepare('INSERT INTO links (code, original_url) VALUES (?, ?)').run(code, url),
  findByCode: (code) =>
    db.prepare('SELECT * FROM links WHERE code = ?').get(code),
  findByUrl: (url) =>
    db.prepare('SELECT * FROM links WHERE original_url = ?').get(url),
  addClick: (code) =>
    db.prepare('UPDATE links SET clicks = clicks + 1 WHERE code = ?').run(code),
  list: () =>
    db.prepare('SELECT code, original_url, clicks, created_at FROM links ORDER BY id DESC LIMIT 50').all(),
};
