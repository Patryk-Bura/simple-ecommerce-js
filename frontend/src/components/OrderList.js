import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/api';
import './OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchOrders = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please log in to view orders');
                setLoading(false);
                return;
            }

            try {
                const userOrders = await getUserOrders(userId);
                setOrders(userOrders);
                setLoading(false);
            } catch (err) {
                setError(err.toString());
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            {/*<h2 className="orders-header">Moje zamówienia</h2>*/}
            <div className="orders-container">
            {orders.length === 0 ? (
                <p>Brak zamówień</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order-item">
                        <h3>Zamówienie #{order.id}</h3>
                        <p><b>Status:</b> {order.status}</p>
                        <p><b>Całkowita kwota:</b> {order.totalAmount.toFixed(2)} PLN</p>
                        <div className="order-products">
                            {order.Products.map(product => (
                                <div key={product.id} className="order-product">
                                    <img 
                                        src={`http://localhost:5000/${product.image}`} 
                                        alt={product.name} 
                                        className="product-image"
                                    />
                                    <div>
                                        <p>{product.name}</p>
                                        <p><b>Ilość:</b> {product.OrderProduct.quantity}</p>
                                        <p><b>Cena:</b> {product.price} PLN</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
            </div>
            </>
    );
};

export default OrderList;