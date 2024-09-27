const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.IransportUnit = dbConf.sequelizeObj.define('transport_unit', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  transportOrder: {
    type: DataTypes.STRING(100)
  },
  lastUpdate: {
    type: DataTypes.DATE
  },
  sourceDestination: {
    type: DataTypes.STRING(100)
  },
  nextDestination: {
    type: DataTypes.STRING(50)
  },
  drection: {
    type: DataTypes.CHAR(2)
  },
  processingResult: {
    type: DataTypes.CHAR(2)
  },
  error: {
    type: DataTypes.STRING(150)
  },
  description: {
    type: DataTypes.STRING(150)
  },
  action: {
    type: DataTypes.STRING(50)
  }
}, {
  timestamps: false
});