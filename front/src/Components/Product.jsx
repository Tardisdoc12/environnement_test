import PropTypes from 'prop-types'

export const Product = ({ productInfo }) => {

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/products/${productInfo.id}`, {
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
            const response = await fetch(`http://localhost:8000/products/${productInfo.id}`, {
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
            <h1>Product</h1>
            <p>{productInfo.name}</p>
            <p>{productInfo.description}</p>
            <p>{productInfo.price}</p>
            <p>{productInfo.quantity}</p>
            <div>
                <input type='button' value={"Edit"} onClick={handleEdit} />
                <input type='button' value={"Delete"} onClick={handleDelete} />
            </div>
        </div>
    )
}

Product.propTypes = {
    productInfo: PropTypes.object.isRequired
}
