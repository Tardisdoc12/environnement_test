const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase(pool) {
    const dbName = `FinTech`;

    await pool.query(`CREATE DATABASE ??`, [dbName]);

    await pool.query(`use ??`, [dbName]);

    return pool;
}


async function checkCreatedDb() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database:  process.env.DB_NAME,
        });
    } catch (error) {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        pool = await createDatabase(pool)

        await createTables()
        
    }

    return pool;
}

async function createTables() {
    await conn.query(`CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        price INT,
        quantity INT,
        name VARCHAR (255),
        description VARCHAR (255),
      )`);
}

module.exports = {
    checkCreatedDb
}