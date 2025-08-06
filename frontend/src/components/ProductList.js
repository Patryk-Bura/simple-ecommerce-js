import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, updateProduct, addToCart, getCart } from '../services/api';
import './ProductList.css';

const ProductList = ({ products: initialProducts, refreshProducts, onAddToCart }) => {
    const [products, setProducts] = useState(initialProducts);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError('Error fetching products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const fetchCart = async (userId) => {
        try {
            const response = await getCart(userId);
            console.log('Cart fetched:', response);
        } catch (err) {
            setError('Error fetching cart');
            console.error('Error fetching cart:', err);
        }
    };


    const handleDelete = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await deleteProduct(productId, token);
            setProducts(products.filter((product) => product.id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Error deleting product');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please log in to add items to the cart.');
                return;
            }

            const response = await addToCart(userId, productId, 1);
            if (response.message === 'Product added to cart') {
                alert('Product added to cart successfully!');
                fetchCart(userId);
            } else {
                setError(response.message || 'Failed to add product to cart.');
            }
        } catch (err) {
            console.error('Error adding product to cart:', err);
            setError('Failed to add product to cart.');
        }
    };


    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentProduct(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewImage(file);
        }
    };

    const handleEditSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const updatedProduct = await updateProduct(currentProduct, token, newImage);
            const data = await getProducts();
            setProducts(data);
            closeEditModal();
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Error updating product');
        }
    };

    if (loading) {
        return <p>Ladowanie produktow...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }



    return (
        <div>
            <h2>Produkty</h2>
            {products.length === 0 ? (
                <p>Brak dostepnych produktow.</p>
            ) : (
                <div className="products-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p><b>Cena:</b> {product.price} PLN</p>
                            <p><b>Ilosc na stanie:</b> {product.quantity}</p>

                            {userId && userId !== '' && !isAdmin && (
                                <button
                                    onClick={() => onAddToCart(product.id)}
                                    className="add-to-cart-button"
                                    disabled={product.quantity === 0}
                                >
                                    {product.quantity === 0 ? 'Brak na magazynie' : 'Dodaj do koszyka'}
                                </button>
                            )}


                            {isAdmin && (
                                <div className="action-buttons">
                                    <button onClick={() => openEditModal(product)} className="edit-button">
                                        Edytuj
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="deletee-button">
                                        Usun
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edytuj produkt</h3>
                        <label>
                            Nazwa:
                            <input
                                type="text"
                                value={currentProduct.name}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Cena:
                            <input
                                type="number"
                                value={currentProduct.price}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, price: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Opis:
                            <textarea
                                value={currentProduct.description}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, description: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Ilosc:
                            <input
                                type="number"
                                value={currentProduct.quantity}
                                onChange={(e) =>
                                    setCurrentProduct({ ...currentProduct, quantity: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Zdjecie:
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <div className="modal-buttons">
                            <button onClick={handleEditSave} className="save-button">
                                Zapisz
                            </button>
                            <button onClick={closeEditModal} className="cancel-button">
                                Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
