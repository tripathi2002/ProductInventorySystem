const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  // Local
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "PIS",
  waitForConnections: true,
  connectionLimit: 50,
  connectTimeout: 30000,
  queueLimit: 100,
  // enableKeepAlive: true,
  // keepAliveInitialDelay: 10000,
});

module.exports = pool;
