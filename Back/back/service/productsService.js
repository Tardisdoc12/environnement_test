 const dbService = require("./databaseService");

const pool = dbService.checkCreatedDb();

// Fonction pour récupérer tous les products
const getProducts = async () => {
    return await pool.query('SELECT * FROM products');
};

// Fonction pour récupérer un product par ID
const getProductsById = async (id) => {
    return await pool.query('SELECT * FROM products WHERE id = ?', [id]);
};

const addProduct = async (price, quantity, name, description) => {
    return await pool.query(`INSERT INTO products (price, quantity, name, description) VALUES (?,?,?,?)`, [price, quantity, name, description]);
};

const deteleProductById = async (id) => {
    return await pool.query(`DELETE FROM products WHERE id = ? `, [id]);
};

const deteleProducts = async () => {
    return await  pool.query('DELETE FROM products')
};

const updateProductById = async (id, name, value) => {
    return await  pool.query('UPDATE products SET ? = ? WHERE id = ?',[name, value, id])
};

module.exports = {
    getProducts,
    getProductsById,
    addProduct,
    deteleProductById,
    deteleProducts,
    updateProductById
};