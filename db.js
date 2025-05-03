import mysql from 'mysql2/promise';

// Initialize database connection
const dbPromise = mysql.createConnection({
  uri: 'mysql://root:waHCvYXZmdNgzwXgqhyrncinprYaRrEm@maglev.proxy.rlwy.net:34617/railway'
});

// Create table if it doesn't exist
dbPromise.then(async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      attending BOOLEAN NOT NULL,
      hasCompanion BOOLEAN DEFAULT FALSE,
      companionName TEXT,
      message TEXT,
      timestamp DATETIME NOT NULL
    )
  `);
});

export default dbPromise; 