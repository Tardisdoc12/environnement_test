 const dbService = require("./databaseService");

 
 // Fonction pour récupérer tous les products
 const getProducts = async () => {
    // console.log('getProducts', pool);
 const pool = await dbService.checkCreatedDb();

    const response = await pool.query('SELECT * FROM products');

    return response[0]
};

// Fonction pour récupérer un product par ID
const getProductsById = async (id) => {
 const pool = await dbService.checkCreatedDb();

    return pool.query('SELECT * FROM products WHERE id = ?', [id]);
};

const addProduct = async (price, quantity, name, description) => {
 const pool = await dbService.checkCreatedDb();

    return pool.query(`INSERT INTO products (price, quantity, name, description) VALUES (?,?,?,?)`, [price, quantity, name, description])[0];
};

const deteleProductById = async (id) => {
 const pool = await dbService.checkCreatedDb();

    return pool.query(`DELETE FROM products WHERE id = ? `, [id]);
};

const deteleProducts = async () => {
 const pool = await dbService.checkCreatedDb();

    return  pool.query('DELETE FROM products')
};

const updateProductById = async (id, name, value) => {
 const pool = await dbService.checkCreatedDb();

    return  pool.query('UPDATE products SET ? = ? WHERE id = ?',[name, value, id])
};

module.exports = {
    getProducts,
    getProductsById,
    addProduct,
    deteleProductById,
    deteleProducts,
    updateProductById
};