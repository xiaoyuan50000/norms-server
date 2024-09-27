const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.TransportUnit = dbConf.sequelizeObj.define('transport_unit', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  transportOrder: {
    type: DataTypes.BIGINT
  },
  lastUpdate: {
    type: DataTypes.DATE
  },
  sourceDestination: {
    type: DataTypes.STRING(255)
  },
  nextDestination: {
    type: DataTypes.STRING(50)
  },
  drection: {
    type: DataTypes.CHAR(1)
  },
  processingResult: {
    type: DataTypes.CHAR(1)
  },
  error: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.STRING(255)
  },
  action: {
    type: DataTypes.STRING(50)
  }
}, {
  timestamps: false
});