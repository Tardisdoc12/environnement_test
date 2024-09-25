/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { render } from '@testing-library/react';
import { Product } from '../Components/Product';
import { describe, expect, test } from 'vitest';

describe('Product Performance', () => {
    test('Measure performance of Product component rendering', () => {
        const productMock = {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            quantity: 10
        }
        const start = performance.now();
        render(<Product productInfo={productMock} onDelete={() => { }} onEdit={() => { }} />);
        const end = performance.now();
        const duration = end - start;
        console.log(`Rendering time Solo Product: ${duration}ms`)
        expect(duration).toBeLessThan(100);
    })

    test('Measure performance of Product component rendering multiple times', () => {
        const productMock = {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            quantity: 10
        }
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            render(<Product productInfo={productMock} onDelete={() => { }} onEdit={() => { }} />);
        }
        const end = performance.now();
        const duration = end - start;
        console.log(`Rendering time Multiple Product: ${duration}ms`)
        expect(duration).toBeLessThan(1000);
    })
})