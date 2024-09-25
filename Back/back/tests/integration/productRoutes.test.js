// Tests Integration / Routes :

// Products

const request = require('supertest');
const express = require('express');
const productsRouter = require('../../routes/productsRoutes');
const dbService = require('../../service/databaseService');

const app = express();
app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use('/api/products', productsRouter); // Utilisation de ton router

// Mock de la fonction checkCreatedDb pour éviter de dépendre de la base de données
jest.mock('../../service/databaseService', () => ({
    checkCreatedDb: jest.fn(), // jest.fn() => mock la base de données
  }));

  describe('Products Routes Intergation Test', () => { 
    
    test('should get all products', async () => {
        const mockPool = { // Objet pool avec une méthode query
            query: 
              jest
                  .fn() //Crée une fonction "mockée" (fausse) pour l'appel SQL.
                  .mockResolvedValue(  //Simule une réponse à l'appel query
                      [[{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]]
                  )
        };

        // Mock/Simule la fonction checkCreatedDb pour retourner mockPool à chaque appel
        dbService.checkCreatedDb.mockResolvedValue(mockPool);

        const response = await request(app).get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
    })
  })