const { Order, OrderProduct } = require('../models/order');
const { Cart, ProductCart } = require('../models/cart');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
    const { userId } = req.body;

    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: Product,
                through: { attributes: ['quantity'] }
            }]
        });

        if (!cart || cart.Products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalAmount = cart.Products.reduce((total, product) => {
            const productCart = product.ProductCart;
            return total + (product.price * productCart.quantity);
        }, 0);

        const order = await Order.create({
            userId,
            totalAmount,
            status: 'PENDING'
        });

        for (const product of cart.Products) {
            const productCart = product.ProductCart;
            await OrderProduct.create({
                OrderId: order.id,
                ProductId: product.id,
                quantity: productCart.quantity
            });

            const updatedQuantity = product.quantity - productCart.quantity;
            await Product.update(
                { quantity: updatedQuantity },
                { where: { id: product.id } }
            );
        }

        await ProductCart.destroy({
            where: { CartId: cart.id }
        });

        res.status(200).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: Product,
                through: { attributes: ['quantity'] }
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};