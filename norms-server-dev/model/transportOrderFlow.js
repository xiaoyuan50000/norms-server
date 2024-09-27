const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.TransportOrderFlow = dbConf.sequelizeObj.define('transport_order_flow', {
  flowId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  path: {
    type: DataTypes.STRING(255)
  },
  detail: {
    type: DataTypes.TEXT
  },
  time: {
    type: DataTypes.DATE
  },
  creator: {
    type: DataTypes.STRING(255)
  }
}, {
  timestamps: false
});