const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
);

// Import models
const Admin = require('../models/Admin')(sequelize);
const Role = require('../models/Role.js')(sequelize);
const Gender = require('../models/Gender.js')(sequelize);
const Donor = require('../models/Donor')(sequelize);
const EventOrganiser = require('../models/EventOrganiser')(sequelize);

// Define associations
Admin.belongsTo(Role);
Admin.belongsTo(Gender);
Donor.belongsTo(Gender);
EventOrganiser.belongsTo(Role);

module.exports = sequelize;