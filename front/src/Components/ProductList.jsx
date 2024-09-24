import { useEffect, useState } from "react"
import { Product } from "./Product"
import { useForm } from 'react-hook-form'
import { toast } from "react-hot-toast"

export const ProductList = () => {

    const { register, handleSubmit } = useForm()

    const [products, setProducts] = useState([])

    const [isAddingProduct, setIsAddingProduct] = useState(false)

    const [modificationCount, setModificationCount] = useState(0)

    const handleAddProduct = async (data) => {
        console.log(data)
        try {
            const response = await fetch(`http://localhost:3000/api/products/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    price: parseInt(data.price),
                    quantity: parseInt(data.quantity)
                })
            })
            if (response.ok) {
                console.log('product added')
                toast.success('Product added')
                setProducts([...products, data])
                setIsAddingProduct(false)
            } else {
                toast.error('Error adding product')
                console.error('error adding product')
            }
        } catch (err) {
            console.error('error adding product', err)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products`)
                const data = await response.json()
                console.log(data)
                setProducts(data)
            } catch (err) {
                console.error('error fetching product', err)
            }
        }

        fetchData()
    }, [modificationCount])

    const handleEditProduct = async (productID, product) => {
        const newProducts = products.map((p) => {
            if (p.id === productID) {
                return product
            }
            return p
        })
        setProducts(newProducts)
        setModificationCount(modificationCount + 1)
    }

    const handleDeleteProduct = async (productId) => {
        const newProducts = products.filter((product) => product.id !== productId)
        setProducts(newProducts)
        setModificationCount(modificationCount + 1)
    }

    return (
        <>
            <h1>ProductList</h1>
            <input type="button" value={"Add Product"} onClick={() => setIsAddingProduct(!isAddingProduct)} />
            {isAddingProduct && (
                <form onSubmit={handleSubmit(handleAddProduct)}>
                    <input type='text' placeholder='name' {...register('name', { required: true })} />
                    <input type='text' placeholder='description' {...register('description', { required: true })} />
                    <input type='text' placeholder='price' {...register('price', { required: true })} />
                    <input type='text' placeholder='quantity' {...register('quantity', { required: true })} />
                    <input type='submit' value={"Add"} />
                </form>
            )}
            {products.map((product, index) => (
                <Product
                    key={index}
                    productInfo={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            ))}
        </>
    )
}