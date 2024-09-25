/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React from 'react'; // Importer React
import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/vitest'; // Importer jest-dom pour utiliser toBeDisabled
import { toast } from 'react-hot-toast'; // Importer react-toastify pour les toasts
import { Product } from "../Components/Product";

const productMock = [
    {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        quantity: 10
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 20,
        quantity: 2
    }
];

describe("Product - Function Error", () => {

    beforeEach(() => {
        global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
        vi.spyOn(toast, 'error'); // Espionner la fonction toast.error
        vi.spyOn(toast, 'success'); // Espionner la fonction toast.success
    });

    describe("handleEdit function", () => {
        test('handleEdit function with empty value', async () => {
            render(
                <>
                    {productMock.map((product) => (
                        <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                    ))}
                </>
            );

            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);

            fireEvent.change(screen.getByDisplayValue('Product 1'), { target: { value: '' } });

            const saveButtons = screen.getAllByText("Save");
            fireEvent.click(saveButtons[0]);

            expect(toast.error).toHaveBeenCalledWith('All fields are required');
        });

        test('handleEdit function with negative price and quantity', async () => {
            render(
                <>
                    {productMock.map((product) => (
                        <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                    ))}
                </>
            );

            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);

            // Récupérer l'élément d'entrée par son id
            const quantityInput = screen.getAllByTestId(`editingQuantity-${productMock[0].id}`);

            // Changer la quantité à une valeur négative
            fireEvent.change(quantityInput[0], { target: { value: '-10' } });

            const saveButtons = screen.getAllByText("Save");
            fireEvent.click(saveButtons[0]);

            expect(toast.error).toHaveBeenCalledWith('Price and quantity must be greater than 0');
        });

        test('handleEdit function with non numeric price and quantity', async () => {
            render(
                <>
                    {productMock.map((product) => (
                        <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                    ))}
                </>
            );

            const editButtons = screen.getAllByText('Edit');
            fireEvent.click(editButtons[0]);

            const priceInput = screen.getAllByTestId(`editingPrice-${productMock[0].id}`);
            fireEvent.change(priceInput[0], { target: { value: 'price' } });

            const saveButtons = screen.getAllByText("Save");
            fireEvent.click(saveButtons[0]);

            expect(toast.error).toHaveBeenCalledWith('Price and quantity must be numbers');
        });
    })

    describe("handleDelete function", () => {
        test('handleDelete check if error is pop', async () => {
            render(
                <>
                    {productMock.map((product) => (
                        <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                    ))}
                </>
            );

            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);

            expect(toast.error).not.toHaveBeenCalled();
        });
    });

});