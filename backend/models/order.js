// models/order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');
const Product = require('./product');
const User = require('./user');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

const OrderProduct = sequelize.define('OrderProduct', {
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
});

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

module.exports = { Order, OrderProduct };
