const mysql = require('mysql2');
require('dotenv').config();

async function createDatabase(pool) {
    const dbName = process.env.DB_NAME;

    await pool.query(`CREATE DATABASE IF NOT EXISTS ??`, [dbName]);

    await pool.query(`use ??`, [dbName]);

    return pool;
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})


async function checkCreatedDb() {

    try {
        const con = await connection.connect()
        if(con) {
            console.log('Connected to the database')
        } else {
            console.log('creating')
            await createDatabase(con)

            await createTables(con)
        }
    } catch(err) {
        console.error('Error connecting to the database', err)
    }

    // try {
    //     pool = mysql.createPool({
    //         host: 'localhost',
    //         user: 'root',
    //         password:'root',
    //         database:  'FinTech',
    //     });
    // } catch (error) {
    //     pool = mysql.createPool({
    //         host: 'localhost',
    //         user: 'root',
    //         password:'root',
    //     });

    //     pool = await createDatabase(pool)

    //     await createTables()
        
    // }

    // return pool;
}

async function createTables(connection) {
    await connection.query(`CREATE TABLE IF NOT EXISTS products (
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