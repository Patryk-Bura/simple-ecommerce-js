const { Cart, ProductCart } = require('../models/cart');
const Product = require('../models/product');

exports.addProductToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock available.' });
        }

        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        const existingProductCart = await ProductCart.findOne({
            where: { CartId: cart.id, ProductId: productId },
        });

        if (existingProductCart) {
            const newQuantity = existingProductCart.quantity + quantity;
            if (newQuantity > product.quantity) {
                return res.status(400).json({ message: 'Exceeds available stock.' });
            }
            existingProductCart.quantity = newQuantity;
            await existingProductCart.save();
        } else {
            if (quantity > product.quantity) {
                return res.status(400).json({ message: 'Exceeds available stock.' });
            }
            await ProductCart.create({
                CartId: cart.id,
                ProductId: productId,
                quantity,
            });
        }

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        await ProductCart.destroy({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });

        return res.status(200).json({ message: 'Product removed from cart.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: {
                model: Product,
                through: { attributes: ['quantity'] },
            },
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.updateProductQuantityInCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock available.' });
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const productInCart = await ProductCart.findOne({
            where: { CartId: cart.id, ProductId: productId },
        });

        if (!productInCart) {
            return res.status(404).json({ message: 'Product not in cart.' });
        }

        if (quantity <= 0) {
            await ProductCart.destroy({
                where: { CartId: cart.id, ProductId: productId },
            });
            return res.status(200).json({ message: 'Product removed from cart.' });
        } else {
            productInCart.quantity = quantity;
            await productInCart.save();
            return res.status(200).json({ message: 'Product quantity updated.' });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.placeOrder = async (req, res) => {
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

        for (const product of cart.Products) {
            const productCart = await ProductCart.findOne({
                where: { CartId: cart.id, ProductId: product.id }
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

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};