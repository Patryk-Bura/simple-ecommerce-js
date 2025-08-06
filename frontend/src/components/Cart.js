import React from 'react';
import { removeFromCart, updateProductQuantity,placeOrder } from '../services/api';
import './Cart.css';

const Cart = ({ cartItems, onRefreshCart,fetchCart,fetchProducts }) => {
    const handleDecreaseQuantity = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID is not found in localStorage.');
            return;
        }

        const item = cartItems.find((item) => item.id === productId);
        if (!item || !item.ProductCart) {
            console.error('Item or ProductCart not found', item);
            return;
        }

        const newQuantity = item.ProductCart.quantity - 1;
        if (newQuantity > 0) {
            try {
                await updateProductQuantity(userId, productId, newQuantity);
                onRefreshCart();
            } catch (err) {
                console.error('Error updating product quantity:', err);
            }
        } else {
            await handleDeleteItem(productId);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        const item = cartItems.find((item) => item.id === productId);

        if (!item || !item.ProductCart) {
            console.error('Item or ProductCart not found', item);
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID is not found in localStorage.');
            return;
        }

        const newQuantity = item.ProductCart.quantity + 1;

        try {
            await updateProductQuantity(userId, productId, newQuantity);
            onRefreshCart();
        } catch (err) {
            console.error('Error updating product quantity in cart:', err);
            alert('Error updating product quantity');
        }
    };

    const handleDeleteItem = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to remove items from the cart.');
            return;
        }

        try {
            const response = await removeFromCart(userId, productId);
            if (response.message === 'Product removed from cart.') {
                onRefreshCart();
            } else {
                alert(response.message || 'Failed to remove item.');
            }
        } catch (err) {
            console.error('Error deleting product from cart:', err);
            alert(err.toString());
        }
    };

    const calculateTotalCost = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.ProductCart.quantity;
        }, 0);
    };

    const totalCost = calculateTotalCost();



    const handlePlaceOrder = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to place an order.');
            return;
        }

        try {
            const response = await placeOrder(userId);
            if (response.message === 'Order placed successfully') {
                alert('Zamowienie zlozone!');

                await fetchCart(userId);
                await fetchProducts();
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert(err.toString());
        }
    };

    

    return (
        <div className="cart-container">
            <h2 className="cart-title">Koszyk</h2>
            {cartItems.length === 0 ? (
                <p className="empty-message">Twój koszyk jest pusty</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-header">
                                <img
                                    src={`http://localhost:5000/${item.image}`}
                                    alt={item.name}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">{item.price} PLN</span>
                                </div>
                            </div>
                            <div className="quantity-container">
                                {item.ProductCart.quantity === 1 ? (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteItem(item.id)}
                                    >
                                        🗑️
                                    </button>
                                ) : (
                                    <button
                                        className="quantity-button-min"
                                        onClick={() => handleDecreaseQuantity(item.id)}
                                    >
                                        -
                                    </button>
                                )}

                                <span className="item-quantity">
                                    {item.ProductCart.quantity}
                                </span>

                                <button
                                    className="quantity-button"
                                    onClick={() => handleIncreaseQuantity(item.id)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="total-cost">
                            <h3>Suma: {totalCost.toFixed(2)} PLN</h3>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={cartItems.length === 0}
                                className="place-order-button"
                            >
                                Zloz zamowienie
                            </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
