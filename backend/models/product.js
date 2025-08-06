// models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Product;
