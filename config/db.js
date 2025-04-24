const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aadil@123456",
  database: "school",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool;
