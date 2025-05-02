const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Door = require('./Door');

const DoorCoordinate = sequelize.define('DoorCoordinate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  door_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Doors',
      key: 'id'
    }
  },
  x_coordinate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  y_coordinate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  z_coordinate: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  rotation: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'door_coordinates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Thiết lập mối quan hệ với Door
DoorCoordinate.belongsTo(Door, { foreignKey: 'door_id', as: 'door' });
Door.hasMany(DoorCoordinate, { foreignKey: 'door_id', as: 'coordinates' });

module.exports = DoorCoordinate;