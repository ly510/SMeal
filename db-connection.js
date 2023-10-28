const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const connection = pool.promise();

module.exports = connection;