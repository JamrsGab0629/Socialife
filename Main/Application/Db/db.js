const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'social_media',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function verifyConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successfully.');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Error Sql was not running');
    }
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  verifyConnection();
}

module.exports = pool;