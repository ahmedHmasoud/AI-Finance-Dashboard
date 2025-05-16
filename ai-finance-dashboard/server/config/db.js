const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DB_URL 
    ? new Sequelize(process.env.DB_URL, {
        dialect: 'postgres',
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    });

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;
