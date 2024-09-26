/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Product } from '../Components/Product';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ProductList } from '../Components/ProductList';
import { toast } from 'react-hot-toast';

describe('Product Security', () => {

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
        vi.spyOn(toast, 'success'); // Espionner la fonction
    });

    test('Check for XSS in Product component', () => {
        // Création d'un mock de produit avec des scripts malveillants dans le nom et la description
        const productMock = {
            id: 1,
            name: '<script>alert("XSS Attack")</script>',
            description: '<script>alert("XSS Attack")</script>',
            price: 10,
            quantity: 10
        }
        // Rendu du composant Product avec les informations du produit mock
        const { container } = render(<Product productInfo={productMock} onDelete={() => { }} onEdit={() => { }} />);
        // Vérification que le nom du produit ne contient pas le script malveillant
        expect(container.innerHTML).not.toContain(productMock.name);
        // Vérification que la description du produit ne contient pas le script malveillant
        expect(container.innerHTML).not.toContain(productMock.description);
    })

    test('Check for XSS in Adding Product', async () => {

        render(<ProductList />);
        const addProductButton = screen.getByText('Add Product');
        fireEvent.click(addProductButton);
        const nameInput = screen.getByTestId('name');
        const descriptionInput = screen.getByTestId('description');
        const priceInput = screen.getByTestId('price');
        const quantityInput = screen.getByTestId('quantity');
        const saveButton = screen.getByText('Add');

        // Test avec des valeurs normales
        fireEvent.change(nameInput, { target: { value: 'Product 3' } });
        fireEvent.change(descriptionInput, { target: { value: 'Description 3' } });
        fireEvent.change(priceInput, { target: { value: '30' } });
        fireEvent.change(quantityInput, { target: { value: '3' } });
        fireEvent.click(saveButton);
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Product added'));

        // Test avec des scripts malveillants
        fireEvent.click(addProductButton);
        fireEvent.change(nameInput, { target: { value: '<script>alert("XSS")</script>' } });
        fireEvent.change(descriptionInput, { target: { value: '<img src="x" onerror="alert(\'XSS\')" />' } });
        fireEvent.change(priceInput, { target: { value: '30' } });
        fireEvent.change(quantityInput, { target: { value: '3' } });
        fireEvent.click(saveButton);

        await waitFor(() => { toast.error('Invalid input detected') });
    });
})