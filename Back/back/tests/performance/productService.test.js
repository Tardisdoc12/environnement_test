// Tests Performance BDD :

// Products

const productsService = require('../../service/productsService');
const dbService = require('../../service/databaseService');

// Mocking dbService
jest.mock('../../service/databaseService');

describe('Performance Tests for Product Service with Large Data Load', () => {
    let mockPool;

    beforeAll(() => {
        // Simuler un pool de connexion
        mockPool = {
            query: jest.fn(),
        };
        dbService.checkCreatedDb.mockResolvedValue(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Ou reserAllMocks()
    });

    const generateLargeDataset = (size) => {
        // Générer une liste de produits simulée avec une grande charge de données
        const products = [];
        for (let i = 0; i < size; i++) {
            products.push({
                id: i + 1,
                name: `Product ${i + 1}`,
                price: Math.floor(Math.random() * 1000),
                quantity: Math.floor(Math.random() * 100),
                description: `Description for Product ${i + 1}`,
            });
        }
        return products;
    };

  // getProducts **************************************************************
    test('Performance test for getProducts with large data set', async () => {
        const largeDataset = generateLargeDataset(100000); // Simulation d'une base de données avec 100,000 produits

        mockPool.query.mockResolvedValue([largeDataset]);

        console.time('getProducts performance with large data'); //  Démarre le chronomètre avant l'exécution de la fonction
        const products = await productsService.getProducts();
        console.timeEnd('getProducts performance with large data'); // Arrête après

        expect(products).toEqual(largeDataset);
        expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM products');
    });

  // addProduct **************************************************************
    test('Performance test for addProduct with multiple entries', async () => {
        const largeDataset = generateLargeDataset(50000); // Simulation de 50,000 produits à ajouter

        // Simuler l'insertion de chaque produit
        mockPool.query.mockResolvedValue([{ affectedRows: 1 }]);

        console.time('addProduct performance with large data set');
        for (const product of largeDataset) {
            await productsService.addProduct(product.price, product.quantity, product.name, product.description);
        }
        console.timeEnd('addProduct performance with large data set');

        expect(mockPool.query).toHaveBeenCalledTimes(50000);
    });

  // deleteProducts **************************************************************
    test('Performance test for deleteProducts with large data set', async () => {
        mockPool.query.mockResolvedValue([{ affectedRows: 100000 }]); // Suppression massive de données simulée

        console.time('deleteProducts performance with large data set');
        await productsService.deteleProducts();
        console.timeEnd('deleteProducts performance with large data set');

        expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM products');
    });
});
