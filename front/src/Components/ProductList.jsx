
// eslint-disable-next-line no-unused-vars
import React from 'react'
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
        if (!data.name || !data.description || !data.price || !data.quantity) {
            toast.error('All fields are required')
            return
        }
        if (data.price <= 0 || data.quantity <= 0) {
            toast.error('Price and quantity must be greater than 0')
            return
        }
        if (isNaN(data.price) || isNaN(data.quantity)) {
            toast.error('Price and quantity must be numbers')
            return
        }
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
                    <input
                        type='text'
                        placeholder='name'
                        {...register('name', { required: true })}
                        data-testid="name"
                    />
                    <input
                        type='text'
                        placeholder='description'
                        {...register('description', { required: true })}
                        data-testid="description"
                    />
                    <input
                        type='text'
                        placeholder='price'
                        {...register('price', { required: true })}
                        data-testid="price"
                    />
                    <input
                        type='text'
                        placeholder='quantity'
                        {...register('quantity', { required: true })}
                        data-testid="quantity"
                    />
                    <input
                        type='submit'
                        value={"Add"}
                    />
                </form>
            )}
            {products.map((product) => (
                <Product
                    key={product.id}
                    productInfo={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            ))}
        </>
    )
}