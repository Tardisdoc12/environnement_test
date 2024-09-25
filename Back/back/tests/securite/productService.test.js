// Tests Sécurité :

// Products

const productsService = require('../../service/productsService');
const dbService = require('../../service/databaseService');

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

    test('should prevent SQL injection in addProduct function', async () => {
        // Simuler une tentative d'injection SQL dans l'input
        const maliciousInput = "'; DROP TABLE products; --";
        const safeData = {
            price: 100,
            quantity: 50,
            name: maliciousInput,
            description: 'Test description',
        };

        // Simuler la réponse de la base de données
        mockPool.query.mockResolvedValue([{ affectedRows: 1 }]);

        // Appeler la fonction addProduct avec des données dangereuses
        await productsService.addProduct(safeData.price, safeData.quantity, safeData.name, safeData.description);

        // Vérifier que la requête SQL exécutée est correctement préparée et protégée contre l'injection SQL
        expect(mockPool.query).toHaveBeenCalledWith(
            'INSERT INTO products (price, quantity, name, description) VALUES (?,?,?,?)',
            [safeData.price, safeData.quantity, safeData.name, safeData.description]
        );
    });
});
