const express = require('express')
const app = express()
const port = 3000
const cors = require("cors")
const mysql = require('mysql2/promise')

const databaseService = require('./service/databaseService')

app.use(cors({
    origin: 'http://localhost:5173'
}))

async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })
        await databaseService.checkConnection(connection)
    } catch(err) {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        })
        try {
            await databaseService.createDatabase(connection)
            try {
                await databaseService.createTables(connection)
            } catch(err) {
                console.error('error creating tables', err)
            }
        } catch (error) {
            console.error('error checking connection', err)

        }
    }
}

initializeDatabase()


// Importer les routes
const productsRoutes = require('./routes/productsRoutes');

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Utiliser les routes
app.use('/api/products', productsRoutes);

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});

// TEST JENKINS
// TEST 2 JENKINS