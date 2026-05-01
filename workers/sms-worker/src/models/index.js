const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const SmsLog = require('./SmsLog')(sequelize, DataTypes);

module.exports = {
  sequelize,
  SmsLog,
};
