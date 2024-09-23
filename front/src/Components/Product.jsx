import PropTypes from 'prop-types'
import { useState } from 'react'

export const Product = ({ productInfo }) => {

    const [product, setProduct] = useState({
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        quantity: productInfo.quantity
    })

    const [isEditing, setIsEditing] = useState(false)

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productInfo.id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                console.log('product deleted')
            } else {
                console.error('error deleting product')
            }
        } catch (err) {
            console.error('error deleting product', err)
        }
    }

    const handleEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'new name',
                    description: 'new description',
                    price: 100
                })
            })
            if (response.ok) {
                console.log('product updated')
            } else {
                console.error('error updating product')
            }
        } catch (err) {
            console.error('error updating product', err)
        }
    }


    return (
        <div>
            {isEditing ? (
                <>
                    <input type='text' value={product.name} />
                    <input type='text' value={product.description} />
                    <input type='text' value={product.price} />
                    <input type='text' value={product.quantity} />
                    <div>
                        <input type='button' value={"Save"} onClick={handleEdit} />
                        <input type='button' value={"Cancel"} onClick={() => setIsEditing(!isEditing)} />
                    </div>
                </>
            ) : (
                <>
                    <p>{productInfo.name}</p>
                    <p>{productInfo.description}</p>
                    <p>{productInfo.price}</p>
                    <p>{productInfo.quantity}</p>
                    <div>
                        <input type='button' value={"Edit"} onClick={() => setIsEditing(!isEditing)} />
                        <input type='button' value={"Delete"} onClick={handleDelete} />
                    </div>
                </>
            )}

        </div>
    )
}

Product.propTypes = {
    productInfo: PropTypes.object.isRequired
}
