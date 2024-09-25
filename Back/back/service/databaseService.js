const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase(pool) {
    const dbName = process.env.DB_NAME;

    await pool.query(`CREATE DATABASE IF NOT EXISTS ??`, [dbName]);

    await pool.query(`use ??`, [dbName]);

    return pool;
}

const checkConnection = async (connection) => {
    connection.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });
}

async function checkCreatedDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })

    return connection
}

async function createTables(connection) {
    await connection.query(`CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        price INT NOT NULL,
        quantity INT NOT NULL,
        name VARCHAR (255) NOT NULL,
        description VARCHAR (255)
      )`);
}

module.exports = {
    checkCreatedDb,
    createDatabase,
    createTables,
    checkConnection
}