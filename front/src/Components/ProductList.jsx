import { useEffect, useState } from "react"
import { Product } from "./Product"

export const ProductList = () => {

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/products`)
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
            {products.map((product, index) => (
                <Product key={index} productInfo={product} />
            ))}
        </>
    )
}