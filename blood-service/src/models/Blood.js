const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Blood = sequelize.define('Blood', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Blood;
};