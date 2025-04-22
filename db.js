import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPromise = open({
  filename: path.join(__dirname, 'rsvps.db'),
  driver: sqlite3.Database
});

// Create table if it doesn't exist
dbPromise.then(async (db) => {
  await db.exec(`
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
});

export default dbPromise; 