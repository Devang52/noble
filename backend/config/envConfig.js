const dotenv = require("dotenv");
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DATABASE;
const DB_PORT = process.env.DB_PORT;
const PORT = process.env.PORT;
const REACT_BASE_URL = process.env.REACT_BASE_URL;

module.exports = { DB_HOST, DB_USER, DB_PASSWORD, DATABASE, DB_PORT, PORT, REACT_BASE_URL };
