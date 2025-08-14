const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventOrganiser = sequelize.define('EventOrganiser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  return EventOrganiser;
};