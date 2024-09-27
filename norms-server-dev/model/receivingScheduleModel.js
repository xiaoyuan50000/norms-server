const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.ReceivingSchedule = dbConf.sequelizeObj.define('receiving_schedule', {
  rsId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  crsNumber: {
    type: DataTypes.BIGINT,
    primaryKey: true,
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
}, {
  timestamps: false,
  primaryKeys: ['rsId', 'crsNumber']
});