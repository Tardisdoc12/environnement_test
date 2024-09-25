// Tests Unitaires / Routes :

// Products

const request = require('supertest');
const express = require('express');
const productsRouter = require('../../routes/productsRoutes');
const productsService = require('../../service/productsService');

const app = express();
app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use('/api/products', productsRouter); // Utilisation de ton router

// Mock du service
jest.mock('../../service/productsService');

describe('Products Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Nettoyer les mocks avant chaque test
    });

    // /products **************************************************************
    test('should return all products', async () => {
        // Mock de la réponse du service
        productsService.getProducts.mockResolvedValue([{ id: 1, name: 'Product A' }]);

        const response = await request(app).get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Product A' }]);
        expect(productsService.getProducts).toHaveBeenCalled();
    });

    // 404
    test('should return 404 if no products are found', async () => {
        // Mock le comportement du service pour retourner null ou un tableau vide
        productsService.getProducts.mockResolvedValue(null); // Ou mockResolvedValue([]);

        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Products non trouvés');
    });

    // 500
    test('should return 500 if there is a server error', async () => {
        // Mock le comportement du service pour lever une erreur
        productsService.getProducts.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Erreur lors de la récupération des products');
    });

    // /products/:id **************************************************************
    test('should return a product by ID', async () => {
        productsService.getProductsById.mockResolvedValue({ id: 1, name: 'Product A', price: 10, quantity: 5, description: 'Description A' });

        const response = await request(app).get('/api/products/1');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1); // Vérifie que l'ID du produit est correct
        expect(productsService.getProductsById).toHaveBeenCalledWith('1'); // Vérifie que le service a été appelé avec l'ID correct
    });

    // 404
    test('should return 404 if product not found by ID', async () => {
        // Mock le comportement du service pour retourner null
        productsService.getProductsById.mockResolvedValue(null);

        const response = await request(app).get('/api/products/1');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product non trouvé');
    });

    //500
    test('should return 500 if there is a server error', async () => {
        // Mock le comportement du service pour lever une erreur
        productsService.getProductsById.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/products/1');
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Erreur lors de la récupération du product');
    });

    // /products/add **************************************************************
    test('should add a new product', async () => {
        productsService.addProduct.mockResolvedValue({ insertId: 1 });

        const response = await request(app)
            .post('/api/products/add')
            .send({ price: 10, quantity: 5, name: 'Product A', description: 'Description A' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product ajouté');
        expect(productsService.addProduct).toHaveBeenCalledWith(10, 5, 'Product A', 'Description A');
    });

    // 404
    test('should return 404 when required fields are missing', async () => {
        jest.resetAllMocks()
        const response = await request(app)
            .post('/api/products/add')
            .send({ }); // Envoi des données manquantes (quantity, name, description)

        expect(response.status).toBe(404);
    });


    // /products/delete/:id **************************************************************
    test('should delete a product by ID', async () => {
        productsService.deteleProductById.mockResolvedValue(true); // Simule la suppression réussie
        
        const response = await request(app).delete('/api/products/delete/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product supprimé'); // Vérifie que le message est correct
        expect(productsService.deteleProductById).toHaveBeenCalledWith('1'); // Vérifie que le service a été appelé avec l'ID correct
    });

    //404
    test('should return 404 when trying to delete a product that does not exist', async () => {
        productsService.deteleProductById.mockResolvedValue(false); // Simule que le produit n'existe pas

        const response = await request(app).delete('/api/products/delete/999'); // ID qui n'existe pas

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product non trouvé'); // Vérifie le message d'erreur
    });

    //500
    test('should return 500 when there is a server error while deleting a product', async () => {
        productsService.deteleProductById.mockRejectedValue(new Error('Server error')); // Simule une erreur du serveur

        const response = await request(app).delete('/api/products/delete/1');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Erreur lors de la suppression du product'); // Vérifie le message d'erreur
    });

    // /products/delete **************************************************************
    test('should delete all products', async () => {
        productsService.deteleProducts.mockResolvedValue(true); // Simule la suppression réussie

        const response = await request(app).delete('/api/products/delete');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Products supprimés'); // Vérifie que le message est correct
        expect(productsService.deteleProducts).toHaveBeenCalled(); // Vérifie que le service a été appelé
    });

    // 500
    test('should return 500 when there is a server error during products deletion', async () => {
        productsService.deteleProducts.mockRejectedValue(new Error('Server error')); // Simule une erreur du serveur

        const response = await request(app)
            .delete('/api/products/delete');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Erreur lors de la suppression des products'); // Vérifie le message d'erreur
    });

    // 404 (aucun produit trouvé)
    test('should return 404 when no products are found to delete', async () => {
        productsService.deteleProducts.mockResolvedValue(false); // Simule l'absence de produits à supprimer

        const response = await request(app)
            .delete('/api/products/delete');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Products non trouvés'); // Vérifie le message d'erreur
    });

    // /products/update/:id **************************************************************
    test('should update a product by ID', async () => {
        jest.resetAllMocks()

        productsService.updateProductById.mockResolvedValue(true); // Simule la mise à jour réussie
        productsService.getProductsById.mockResolvedValue({ id: 1, name: 'Product A', price: 10, quantity: 5, description: 'Description A' });
        
        const updatedProduct = { price: 15, quantity: 10 }; // Les nouvelles données
        const response = await request(app).put('/api/products/update/1').send(updatedProduct);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product mis à jour'); // Vérifie que le message est correct
        expect(productsService.updateProductById).toHaveBeenCalledWith('1', updatedProduct); // Vérifie que le service a été appelé avec l'ID et les nouvelles données
    });

    // 404
    test('should return 404 when trying to update a product that does not exist', async () => {
        jest.resetAllMocks()
        
        productsService.updateProductById.mockResolvedValue(false); // Simule que le produit n'existe pas

        const updatedProduct = { price: 15, quantity: 10 };
        const response = await request(app).put('/api/products/update/999').send(updatedProduct); // Utilise un ID qui n'existe pas

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product non trouvé'); // Vérifie le message d'erreur
    });

    // 500
    test('should return 500 when there is a server error while updating a product', async () => {
        jest.resetAllMocks()
        productsService.getProductsById.mockResolvedValue(new Error('Server error'))
        productsService.updateProductById.mockRejectedValue(new Error('Server error')); // Simule une erreur du serveur

        const updatedProduct = { price: 15, quantity: 10 };
        const response = await request(app).put('/api/products/update/1').send(updatedProduct);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Erreur lors de la récupération du product'); // Vérifie le message d'erreur
    });
});
