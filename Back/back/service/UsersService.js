const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Fonction pour récupérer tous les utilisateurs
const getUsers = async () => {
    return users;
};

// Fonction pour récupérer un utilisateur par ID
const getUserById = async (id) => {
    return users.find(user => user.id === parseInt(id));
};

module.exports = {
    getUsers,
    getUserById,
};