import { useEffect, useState } from "react"
import { Product } from "./Product"
import { useForm } from 'react-hook-form'
import { toast } from "react-hot-toast"

export const ProductList = () => {

    const { register, handleSubmit } = useForm()

    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'product 1',
            description: 'description 1',
            price: 100,
            quantity: 10
        },
        {
            id: 2,
            name: 'product 2',
            description: 'description 2',
            price: 200,
            quantity: 2
        }
    ])

    const [isAddingProduct, setIsAddingProduct] = useState(false)

    const handleAddProduct = async (data) => {
        // try {
        //     const response = await fetch(`http://localhost:3000/products`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             name: data.name,
        //             description: data.description,
        //             price: data.price,
        //             quantity: data.quantity
        //         })
        //     })
        //     if (response.ok) {
        //         console.log('product added')
        //         toast.success('Product added')
        //         setIsAddingProduct(false)
        //     } else {
        //         toast.error('Error adding product')
        //         console.error('error adding product')
        //     }
        // } catch (err) {
        //     console.error('error adding product', err)
        // }

        const newProduct = {
            id: products.length + 1,
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity
        }

        setProducts([...products, newProduct])
        toast.success('Product added')
        setIsAddingProduct(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products`)
                const data = await response.json()
                setProducts(data)
            } catch (err) {
                console.error('error fetching product', err)
            }
        }

        fetchData()
    }, [])

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
                <Product key={index} productInfo={product} />
            ))}
        </>
    )
}