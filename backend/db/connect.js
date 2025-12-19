const mysql = require("mysql2");

function connectDb() {
  return new Promise((resolve, reject) => {
    const db = mysql.createConnection({

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

    db.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return reject(err);
      }
      console.log("Connected to MySQL database");
      resolve(db);
    });
  });
}

module.exports = connectDb;
