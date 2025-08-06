import React, { useState, useEffect } from 'react';
import { getProducts, getCart, addToCart } from './services/api';
import Login from './components/login';
import Register from './components/register';
import Header from './components/header';
import AdminPanel from './components/AdminPanel';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderList from './components/OrderList';
import Footer from './components/Footer';
import './App.css';

const App = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [cartItems, setCartItems] = useState([]);

    const [currentView, setCurrentView] = useState('products');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        const userId = localStorage.getItem('userId');
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus);
            if (userId) {
                fetchCart(userId);
            }
        }
        fetchProducts();
        setLoading(false);
    }, []);

    const fetchCart = async (userId) => {
        try {
            const cartData = await getCart(userId);
            setCartItems(cartData.Products || []);
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleAddToCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to add items to the cart.');
            return;
        }

        try {
            const response = await addToCart(userId, productId, 1);
            if (response.message === 'Product added to cart successfully') {
                await fetchCart(userId);
            } else {
                console.error(response.message || 'Failed to add product to cart.');
            }
        } catch (err) {
            console.error('Error adding product to cart:', err);
            alert(err.toString());
        }
    };

    const handleOrdersClick = () => {
        setCurrentView('orders');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentView('products');
    };

    const toggleLoginForm = () => {
        setIsLogin(true);
        setShowAuthForm(true);
    };

    const toggleRegisterForm = () => {
        setIsLogin(false);
        setShowAuthForm(true);
    };

    const closeAuthForm = () => {
        setShowAuthForm(false);
    };

    const handleBackToProductsClick = () => {
        setCurrentView('products');
        setShowAuthForm(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <Header
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                onLoginClick={toggleLoginForm}
                onRegisterClick={toggleRegisterForm}
                onOrdersClick={handleOrdersClick}
                onBackToProductsClick={handleBackToProductsClick}
            />
            {showAuthForm && !isLoggedIn ? (
                <div>
                    {isLogin ? (
                        <Login
                            setIsLoggedIn={setIsLoggedIn}
                            setIsLogin={setIsLogin}
                            setIsAdmin={setIsAdmin}
                            onClose={closeAuthForm}
                            onCartFetched={fetchCart}
                            onBackToProductsClick={handleBackToProductsClick}
                        />
                    ) : (
                        <Register
                            setIsLogin={setIsLogin}
                                onClose={closeAuthForm}
                                onBackToProductsClick={handleBackToProductsClick}
                        />
                    )}
                </div>
            ) : (
                    isLoggedIn ? (
                        <div className="admi-prod">
                            {isAdmin && (
                                <AdminPanel onProductAdded={fetchProducts} />
                            )}
                            {currentView === 'products' && !isAdmin && (
                                <Cart
                                    cartItems={cartItems}
                                    onRefreshCart={() => fetchCart(localStorage.getItem('userId'))}
                                    onRefreshProducts={fetchProducts}
                                    fetchCart={fetchCart}
                                    fetchProducts={fetchProducts}
                                    onOrdersClick={handleOrdersClick}
                                />
                            )}
                            {currentView === 'products' && (
                                <div className="flex-grow">
                                    <ProductList
                                        products={products}
                                        refreshProducts={fetchProducts}
                                        isAdmin={isAdmin}
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>

                            )}

                           

                            {currentView === 'orders' && (
                                <div>
                                    <OrderList />
                                    
                                </div>
                            )}
                            
                        </div>
                ) : (
                            <div>
                                <div className="main-image-container">
                                    <img
                                        src="http://localhost:5000/public/banner.webp"
                                        alt="Main banner"
                                        className="main-image"
                                    />
                                </div>

                                <ProductList products={products} />
                            </div>


                )
            )}
            <Footer />
        </div>
    );
};

export default App;