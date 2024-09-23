const express = require('express')
const app = express()
const port = 3000


// Importer les routes
const userRoutes = require('./routes/userRoutes');

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Utiliser les routes
app.use('/api/users', userRoutes);

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
