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
   }, {
      tableName: 'blood',      // Explicit table name (avoids Sequelize auto-pluralizing)
      timestamps: true,        // Adds createdAt & updatedAt fields automatically
      underscored: true           // Uses snake_case column names in DB
    
  });

  Blood.associate = (models) => {
    Blood.hasMany(models.BloodRequest, {  // one blood type → many requests
      foreignKey: 'blood_id',
      as: 'requests'
    });
  };
  return Blood;
};