/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductList } from "../Components/ProductList";
import { toast } from 'react-hot-toast';

const productMock = [
    {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        quantity: 1
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 20,
        quantity: 2
    }
];

describe("Product List", () => {

    beforeEach(() => {
        global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(productMock) }));
        vi.spyOn(toast, 'success'); // Espionner la fonction toast.error
    });

    test('handleAddProduct function', async () => {
        render(<ProductList />);
        const addProductButton = screen.getByText('Add Product');
        fireEvent.click(addProductButton);
        const nameInput = screen.getByTestId('name')
        const descriptionInput = screen.getByTestId('description');
        const priceInput = screen.getByTestId('price');
        const quantityInput = screen.getByTestId('quantity');
        const saveButton = screen.getByText('Add');
        fireEvent.change(nameInput, { target: { value: 'Product 3' } });
        fireEvent.change(descriptionInput, { target: { value: 'Description 3' } });
        fireEvent.change(priceInput, { target: { value: '30' } });
        fireEvent.change(quantityInput, { target: { value: '3' } });
        fireEvent.click(saveButton);
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Product added'));
    })
})