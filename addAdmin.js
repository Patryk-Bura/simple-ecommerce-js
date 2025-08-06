const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

(async () => {
    try {
        await sequelize.sync();

        const existingAdmin = await User.findOne({ where: { isAdmin: true } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10); 

            const admin = await User.create({
                username: 'admin',
                email: 'admin@admin.pl',
                password: hashedPassword,
                isAdmin: true,
            });

            console.log('Admin has been created:', admin.username);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Database connection error:', error);
    }
})();
