const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

// Import models
const Blood = require('../models/Blood')(sequelize);
const BloodRequest = require('../models/BloodRequest')(sequelize);
module.exports = {
  sequelize,
  models: {
    Blood,
    BloodRequest,
  },}
