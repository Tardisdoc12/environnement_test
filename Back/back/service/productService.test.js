// Tests Unitaires :

// Products

const productsService = require('../service/productsService');
const dbService = require('../service/databaseService');

// Mock de la fonction checkCreatedDb pour éviter de dépendre de la base de données
jest.mock('../service/databaseService', () => ({
  checkCreatedDb: jest.fn(), // jest.fn() => mock la base de données
}));

//describe() => pour organiser et regrouper les tests concernant une même fonctionnalité
//           => ajoute un titre aux tests qui se trouvent à l'intérieur
describe('Products Service Tests', () => { 

  // getProducts **************************************************************
  it('should get all products', async () => {
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
    
    const products = await productsService.getProducts();
    
    // Vérifie que la fonction query a bien été appelée et qu'elle utilise la bonne requête SQL
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM products');
    //  Vérifie que la fonction query a bien été appelée et qu'elle retourne le bon résultat
    expect(products).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
  });

  // getProductsById **************************************************************
  it('should get a product by ID', async () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue([{ id: 1, name: 'Product 1' }])
    };

    dbService.checkCreatedDb.mockResolvedValue(mockPool);

    const product = await productsService.getProductsById(1);

    // Vérifie que query a été appelée avec le bon SQL et paramètre
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = ?', [1]);
    expect(product).toEqual([{ id: 1, name: 'Product 1' }]);
  });

  // addProduct **************************************************************
  it('should add a new product', async () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue([{ insertId: 1 }])
    };
  
    dbService.checkCreatedDb.mockResolvedValue(mockPool);
  
    const result = await productsService.addProduct(10, 5, 'Product A', 'Description A');
  
    expect(mockPool.query).toHaveBeenCalledWith(
      'INSERT INTO products (price, quantity, name, description) VALUES (?,?,?,?)',
      [10, 5, 'Product A', 'Description A']
    );
    expect(result).toEqual({ insertId: 1 });
  });

  // updateProductById **************************************************************
  it('should update a product by ID', async () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue({ affectedRows: 1 })
    };
  
    dbService.checkCreatedDb.mockResolvedValue(mockPool);
  
    const data = { price: 20, name: 'Product B' };
    const result = await productsService.updateProductById(1, data);
  
    expect(mockPool.query).toHaveBeenCalledWith(
      'UPDATE products SET price= ?, name= ? WHERE id = ?',
      [20, 'Product B', 1]
    );
    expect(result).toEqual({ affectedRows: 1 });
  });
  
  

});
