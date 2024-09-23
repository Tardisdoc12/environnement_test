const express = require('express');
const router = express.Router();
const productsService = require('../service/productsService');

// Route pour obtenir tous les products
router.get('/', async (req, res) => {
    try {
        const products = await productsService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des products' });
    }
});

// Route pour obtenir un product par ID
router.get('/:id', async (req, res) => {
    try {
        const product = await productsService.getProductsById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du product' });
    }
});

// Route pour ajouter un product
router.post('/add', async (req, res) => {
    const {price, quantity, name, description} = req.body
    try {
        const resutl = await productsService.addProduct(price, quantity, name, description);
        if (resutl) {
            res.status(200).json({ message: 'Product ajouté' });
        } else {
            res.status(404).json({ message: 'Product non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du product' });
    }
});

// Route pour supprimer un product par ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await productsService.deteleProductById(req.params.id);
        if (result) {
            res.status(200).json({ message: 'Product supprimé' });
        } else {
            res.status(404).json({ message: 'Product non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du product' });
    }
});

// Route pour supprimer les products
router.delete('/delete', async (req, res) => {
    try {
        const result = await productsService.deteleProducts();
        if (result) {
            res.status(200).json({ message: 'Products supprimés' });
        } else {
            res.status(404).json({ message: 'Products non trouvés' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du product' });
    }
});

// Route pour mettre à jour un produit par ID
router.put('/update/:id', async (req, res) => {
    try {
        const result = await productsService.updateProductById(req.params.id);
        if (result) {
            res.status(200).json({ message: 'Product mis à jour' });
        } else {
            res.status(404).json({ message: 'Product non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du product' });
    }
});



module.exports = router;
