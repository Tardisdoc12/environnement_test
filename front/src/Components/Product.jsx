import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const Product = ({ productInfo, onEdit, onDelete }) => {
    const [product, setProduct] = useState({
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        quantity: productInfo.quantity
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/delete/${productInfo.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Product deleted');
                onDelete(productInfo.id);
                toast.success('Product deleted');
            } else {
                console.error('Error deleting product');
                toast.error('Error deleting product');
            }
        } catch (err) {
            console.error('Error fetching delete product', err);
            toast.error('Error deleting product');
        }
    };

    const handleEdit = async () => {

        const containsScriptName = /<script.*?>.*?<\/script>/.test(product.name);
        const containsScriptDescription = /<script.*?>.*?<\/script>/.test(product.description);
        const containsScriptPrice = /<script.*?>.*?<\/script>/.test(product.price);
        const containsScriptQuantity = /<script.*?>.*?<\/script>/.test(product.quantity);

        if (containsScriptName || containsScriptDescription || containsScriptPrice || containsScriptQuantity) {
            toast.error('Invalid input detected');
            return;
        }

        if (product.name === '' || product.description === '' || product.price === '' || product.quantity === '') {
            toast.error('All fields are required');
            setProduct(productInfo)
            return;
        }

        if (product.price <= 0 || product.quantity <= 0) {
            toast.error('Price and quantity must be greater than 0');
            setProduct(productInfo)
            return;
        }

        if (isNaN(product.price) || isNaN(product.quantity)) {
            toast.error('Price and quantity must be numbers');
            setProduct(productInfo)
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/products/update/${productInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity
                })
            });
            if (response.ok) {
                console.log('product edited');
                onEdit(product.id, product); // Appeler onEdit après édition
            } else {
                console.error('error editing product');
            }
        } catch (err) {
            console.error('error fetching update product', err);
        }
    };

    if (isEditing) {
        return (
            <div>
                <input
                    type="text"
                    id={`name-${productInfo.id}`}
                    data-testid={`editingName-${productInfo.id}`}
                    value={product.name}  // Utilise l'état local product
                    onChange={(e) => setProduct({ ...product, name: e.target.value })} // Modifie l'état local product
                />
                <input
                    type="text"
                    id={`description-${productInfo.id}`}
                    data-testid={`editingDescription-${productInfo.id}`}
                    value={product.description}  // Utilise l'état local product
                    onChange={(e) => setProduct({ ...product, description: e.target.value })} // Modifie l'état local product
                />
                <input
                    type="number"
                    id={`price-${productInfo.id}`}
                    data-testid={`editingPrice-${productInfo.id}`}
                    value={product.price}  // Utilise l'état local product
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })} // Assure que la valeur est bien un nombre
                />
                <input
                    type="number"
                    id={`quantity-${productInfo.id}`}
                    data-testid={`editingQuantity-${productInfo.id}`}
                    value={product.quantity}  // Utilise l'état local product
                    onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })} // Assure que la valeur est bien un nombre
                />
                <button onClick={handleEdit}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    } else {
        return (
            <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <p>{product.quantity}</p>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        );
    }
};

Product.propTypes = {
    productInfo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};
