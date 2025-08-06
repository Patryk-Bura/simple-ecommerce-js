const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sklep.sqlite',
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;
