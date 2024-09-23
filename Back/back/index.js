const express = require('express')
const app = express()
const port = 3000
const cors = require("cors")

app.use(cors({
    origin: 'http://localhost:5173'
}))

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
