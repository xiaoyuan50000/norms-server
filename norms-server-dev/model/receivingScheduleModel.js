const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.ReceivingSchedule = dbConf.sequelizeObj.define('receiving_schedule', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  crsNumber: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING(255),
  },
  createdBy: {
    type: DataTypes.STRING(255),
  },
  lastUpdatedDate: {
    type: DataTypes.DATE,
  },
  barcode: {
    type: DataTypes.STRING(255),
  },
  minWeight: {
    type: DataTypes.STRING(255),
  },
  maxWeight: {
    type: DataTypes.STRING(255),
  },
  weightCheck: {
    type: DataTypes.STRING(255),
  },
  tuNumber: {
    type: DataTypes.STRING(255),
  },
  craneID: {
    type: DataTypes.BIGINT,
  },
  locationX: {
    type: DataTypes.DECIMAL(18, 4),
  },
  locationY: {
    type: DataTypes.DECIMAL(18, 4),
  },
  locationZ: {
    type: DataTypes.DECIMAL(18, 4),
  },
  binNumber: {
    type: DataTypes.STRING(255),
  },
  labelPrinter: {
    type: DataTypes.STRING(255),
  },
  irtMember1: {
    type: DataTypes.STRING(255),
  },
  irtMember2: {
    type: DataTypes.STRING(255),
  },
}, {
  timestamps: false,
  primaryKeys: ['id', 'crsNumber']
});