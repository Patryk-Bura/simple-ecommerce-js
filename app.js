const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const path = require('path');
const cors = require('cors');

const userController = require('./backend/controllers/userController');
const productController = require('./backend/controllers/productController');
const cartController = require('./backend/controllers/cartController');
const orderController = require('./backend/controllers/orderController');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'frontend')));

// Database sync
sequelize.sync().then(() => {
    console.log('Database has been synchronized.');
});

// Order routes
app.post('/api/order', orderController.createOrder);
app.get('/api/orders/:userId', orderController.getUserOrders);

// User routes
app.post('/api/register', userController.register);
app.post('/api/login', userController.login);

// Product routes
app.get('/api/products', productController.getProducts);
app.post('/api/products', productController.addProduct);
app.delete('/api/products/:productId', productController.deleteProduct);
app.put('/api/products/:productId', productController.updateProduct);

// Cart routes
app.post('/api/cart', cartController.addProductToCart);
app.delete('/api/cart', cartController.removeProductFromCart);
app.get('/api/cart/:userId', cartController.getCart);
app.put('/api/cart/update', cartController.updateProductQuantityInCart);
app.post('/api/order', cartController.placeOrder);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Application is running on port: ${port}`);
    });
}
