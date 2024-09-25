/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Product } from "../Components/Product";
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

describe("Product", () => {

    beforeEach(() => {
        global.fetch = vi.fn((url) => {
            if (url.includes('update')) {
                return Promise.resolve({ ok: true });
            }
            if (url.includes('delete')) {
                return Promise.resolve({ ok: true });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve(productMock) });
        });
        vi.spyOn(toast, 'error'); // Espionner la fonction toast.error
    });

    test('Content Product', () => {
        render(
            <>
                {productMock.map((product) => (
                    <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                ))}
            </>
        );
        // Tester si le nom, la description, le prix et la quantité sont bien affichés
        expect(screen.getByText('Product 1')).toBeTruthy();
        expect(screen.getByText('Description 1')).toBeTruthy();
        expect(screen.getByText('10')).toBeTruthy();
        expect(screen.getByText('1')).toBeTruthy();
    });

    test('handleEdit function', async () => {
        render(
            <>
                {productMock.map((product) => (
                    <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                ))}
            </>
        );

        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);

        // Vérifier que les valeurs originales sont affichées
        expect(screen.getByDisplayValue('Product 1')).toBeTruthy();
        expect(screen.getByDisplayValue('Description 1')).toBeTruthy();

        // Simuler le changement des valeurs
        fireEvent.change(screen.getByDisplayValue('Product 1'), { target: { value: 'Updated Product 1' } });
        fireEvent.change(screen.getByDisplayValue('Description 1'), { target: { value: 'Updated Description 1' } });

        // Cliquer sur "Save" pour sauvegarder les nouvelles valeurs
        fireEvent.click(screen.getByText('Save'));

        // Vérifier que fetch a été appelé avec les données modifiées après le changement
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/products/update/1',
            expect.objectContaining({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Updated Product 1',   // <- La nouvelle valeur du nom
                    description: 'Updated Description 1',  // <- La nouvelle description
                    price: productMock[0].price,
                    quantity: productMock[0].quantity
                })
            })
        );
    });

    test('handleDelete function', async () => {
        render(
            <>
                {productMock.map((product) => (
                    <Product key={product.id} productInfo={product} onDelete={() => { }} onEdit={() => { }} />
                ))}
            </>
        );

        const deleteButtons = screen.getAllByText('Delete');
        const product1DeleteButton = deleteButtons.find((button) => {
            const productElement = button.closest('div').querySelector('h3');
            return productElement && productElement.textContent === 'Product 1';
        });

        expect(product1DeleteButton).toBeTruthy();
        fireEvent.click(product1DeleteButton);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/products/delete/1',
            expect.objectContaining({
                method: 'DELETE',
            })
        );
    });
});

