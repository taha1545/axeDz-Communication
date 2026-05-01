const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const EmailLog = require('./EmailLog')(sequelize, DataTypes);

module.exports = {
  sequelize,
  EmailLog,
};
