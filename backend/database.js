const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set. Please set it to your PostgreSQL connection string.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      studentname TEXT NOT NULL,
      coursecode TEXT NOT NULL,
      comments TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  pool.query(createTableQuery, (err, res) => {
    if (err) {
      console.error('Error creating table:', err);
      console.error('Error details:', err.message, err.stack);
    } else {
      console.log('Feedback table ready.');
    }
  });
}

initializeDatabase();

module.exports = pool;
