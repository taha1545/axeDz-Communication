require('./env');
const { Sequelize } = require('sequelize');

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_POOL_MAX,
    DB_POOL_MIN,
    DB_POOL_ACQUIRE,
    DB_POOL_IDLE,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : undefined,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: DB_POOL_MAX ? Number(DB_POOL_MAX) : undefined,
        min: DB_POOL_MIN ? Number(DB_POOL_MIN) : undefined,
        acquire: DB_POOL_ACQUIRE ? Number(DB_POOL_ACQUIRE) : undefined,
        idle: DB_POOL_IDLE ? Number(DB_POOL_IDLE) : undefined,
    },
});

module.exports = sequelize;
