import PropTypes from 'prop-types';
import { useState } from 'react';

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
                console.log('product deleted');
                onDelete(productInfo.id); // Appeler onDelete après suppression
            } else {
                console.error('error deleting product');
            }
        } catch (err) {
            console.error('error deleting product', err);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/update/${productInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            if (response.ok) {
                console.log('product edited');
                onEdit(productInfo.id, product); // Appeler onEdit après édition
            } else {
                console.error('error editing product');
            }
        } catch (err) {
            console.error('error editing product', err);
        }
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                    <input
                        type="text"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                    <input
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    />
                    <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                    />
                    <button onClick={handleEdit}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                    <p>{product.quantity}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

Product.propTypes = {
    productInfo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};