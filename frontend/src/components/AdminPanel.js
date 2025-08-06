import React, { useState } from 'react';
import { addProduct } from '../services/api';
import './AdminPanel.css';

const AdminPanel = ({ onProductAdded }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProduct = { name, price, description, quantity, image };

        try {
            const response = await addProduct(newProduct, token);
            setMessage('Product added successfully');
            if (onProductAdded) {
                onProductAdded();
            }
            setName('');
            setPrice('');
            setDescription('');
            setQuantity(1);
            setImage(null);
        } catch (error) {
            setMessage('Error adding product');
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="admin-panel">
            <h2>Dodaj nowy produkt</h2>
            {message && <p className={message.includes('Error') ? 'error' : ''}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Cena</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Opis</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Ilosc</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label>Zdjecie</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit">Dodaj produkt</button>
            </form>
        </div>
    );
};

export default AdminPanel;
