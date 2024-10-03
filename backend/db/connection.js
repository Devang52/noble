// connection.js
const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DATABASE, DB_PORT } = require("../config/envConfig");

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
    port: DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = { db };
