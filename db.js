import mysql from 'mysql2/promise';

// Initialize a database connection pool instead of a single connection
const pool = mysql.createPool({
  uri: 'mysql://root:waHCvYXZmdNgzwXgqhyrncinprYaRrEm@maglev.proxy.rlwy.net:34617/railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create table if it doesn't exist
pool.execute(`
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
`).catch(err => {
  console.error('Error initializing database table:', err);
});

export default pool; 