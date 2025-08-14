const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Donor = sequelize.define('Donor', {
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
    },
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Donor;
};