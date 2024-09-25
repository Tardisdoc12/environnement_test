// Tests  Sécurité / Routes :

// Products

const request = require('supertest');
const express = require('express');

const productsService = require('../../service/productsService');
const productsRoutes = require('../../routes/productsRoutes');
const dbService = require('../../service/databaseService');

const app = express();
app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use('/api/products', productsRoutes); // Utilisation de ton router

// Mocking dbService to avoid real database interaction
jest.mock('../../service/databaseService');

describe('Security Tests for Product Service', () => {
    let mockPool;

    beforeAll(() => {
        // Simuler un pool de connexion
        mockPool = {
            query: jest.fn(),
        };
        dbService.checkCreatedDb.mockResolvedValue(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should validate inputs and prevent financial fraud', async () => {
        // Essayer de soumettre un prix négatif (vulnérabilité potentielle)
        const invalidProductData = {
            price: -100, // Prix non valide
            quantity: 50,
            name: 'Product Test',
            description: 'Test description',
        };

        const response = await request(app)
            .post('/api/products/add')
            .send(invalidProductData);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Le prix doit être suppérieur à 0');
    });

});