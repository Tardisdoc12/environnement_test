// Tests Unitaires / Routes :

// Products

const request = require('supertest');
const express = require('express');
const productsRouter = require('../routes/productsRoutes');
const productsService = require('../service/productsService');

const app = express();
app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use('/api/products', productsRouter); // Utilisation de ton router

// Mock du service
jest.mock('../service/productsService');

describe('Products Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Nettoyer les mocks avant chaque test
    });

    // /products
    test('should return all products', async () => {
        // Mock de la réponse du service
        productsService.getProducts.mockResolvedValue([{ id: 1, name: 'Product A' }]);

        const response = await request(app).get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Product A' }]);
        expect(productsService.getProducts).toHaveBeenCalled();
    });

    // /products/:id
    test('should return a product by ID', async () => {
        productsService.getProductsById.mockResolvedValue({ id: 1, name: 'Product A', price: 10, quantity: 5, description: 'Description A' });

        const response = await request(app).get('/api/products/1');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1); // Vérifie que l'ID du produit est correct
        expect(productsService.getProductsById).toHaveBeenCalledWith('1'); // Vérifie que le service a été appelé avec l'ID correct
    });

    // /products/add
    test('should add a new product', async () => {
        productsService.addProduct.mockResolvedValue({ insertId: 1 });

        const response = await request(app)
            .post('/api/products/add')
            .send({ price: 10, quantity: 5, name: 'Product A', description: 'Description A' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product ajouté');
        expect(productsService.addProduct).toHaveBeenCalledWith(10, 5, 'Product A', 'Description A');
    });

    // /products/delete/:id
    test('should delete a product by ID', async () => {
        productsService.deteleProductById.mockResolvedValue(true); // Simule la suppression réussie
        
        const response = await request(app).delete('/api/products/delete/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product supprimé'); // Vérifie que le message est correct
        expect(productsService.deteleProductById).toHaveBeenCalledWith('1'); // Vérifie que le service a été appelé avec l'ID correct
    });

    // /products/delete
    test('should delete all products', async () => {
        productsService.deteleProducts.mockResolvedValue(true); // Simule la suppression réussie

        const response = await request(app).delete('/api/products/delete');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Products supprimés'); // Vérifie que le message est correct
        expect(productsService.deteleProducts).toHaveBeenCalled(); // Vérifie que le service a été appelé
    });

    // /products/update/:id
    test('should update a product by ID', async () => {
        productsService.updateProductById.mockResolvedValue(true); // Simule la mise à jour réussie
        const updatedProduct = { price: 15, quantity: 10 }; // Les nouvelles données
        const response = await request(app).put('/api/products/update/1').send(updatedProduct);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product mis à jour'); // Vérifie que le message est correct
        expect(productsService.updateProductById).toHaveBeenCalledWith('1', updatedProduct); // Vérifie que le service a été appelé avec l'ID et les nouvelles données
    });
});
