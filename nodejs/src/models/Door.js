const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Floor = require('./Floor');

const Door = sequelize.define('Door', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  floor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Floors',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('main', 'emergency', 'service', 'other'),
    allowNull: false,
    defaultValue: 'main'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'doors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Thiết lập mối quan hệ với Floor
Door.belongsTo(Floor, { foreignKey: 'floor_id', as: 'floor' });
Floor.hasMany(Door, { foreignKey: 'floor_id', as: 'doors' });

module.exports = Door;