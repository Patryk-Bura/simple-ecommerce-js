import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/register`, { username, email, password });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        if (error.response) {
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response.data);
        }
        throw error.response?.data?.message || 'Registration error';
    }
};



export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Login failed', error);
        throw error.response?.data?.message || 'Login error';
    }
};


export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products', error);
        throw error.response?.data?.message || 'Error fetching products';
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post(
            `${API_URL}/api/cart`,
            {
                userId: userId.toString(),
                productId: productId.toString(),
                quantity
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error adding product to cart:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Error adding product to cart';
    }
};

export const getCart = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/cart/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cart', error);
        throw error.response?.data?.message || 'Error fetching cart';
    }
};


export const updateProductQuantity = async (userId, productId, quantity) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.put(
            `${API_URL}/api/cart/update`,
            {
                userId: userId.toString(),
                productId: productId.toString(),
                quantity
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating product quantity in cart:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Error updating product quantity in cart';
    }
};


export const removeFromCart = async (userId, productId) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.delete(
            `${API_URL}/api/cart`, // API URL for removing product
            {
                data: {
                    userId: userId.toString(),
                    productId: productId.toString()
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error removing product from cart:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Error removing product from cart';
    }
};

export const placeOrder = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/api/order`,
            { userId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error.response?.data?.message || 'Error placing order';
    }
};

export const getUserOrders = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/orders/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error.response?.data?.message || 'Error fetching orders';
    }
};


export const deleteProduct = async (productId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error.response?.data?.message || 'Error deleting product';
    }
};

export const addProduct = async (newProduct, token) => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('quantity', newProduct.quantity);
    if (newProduct.image) {
        formData.append('image', newProduct.image);
    }

    try {
        const response = await axios.post(`${API_URL}/api/products`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding product', error);
        throw error.response?.data?.message || 'Error adding product';
    }
};


export const updateProduct = async (product, token, newImage) => {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('quantity', product.quantity);

    if (newImage) {
        formData.append('image', newImage);
    }

    const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to update product');
    }

    return await response.json();
};

