import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database(path.join(__dirname, 'rsvps.db'));

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    attending INTEGER NOT NULL,
    hasCompanion INTEGER DEFAULT 0,
    companionName TEXT,
    message TEXT,
    timestamp TEXT NOT NULL
  )
`);

export default db; 