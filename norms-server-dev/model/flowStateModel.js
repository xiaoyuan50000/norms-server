const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.FlowStateModel = dbConf.sequelizeObj.define('flow_state', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  transportOrder: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sourceDestination: {
    type: DataTypes.BIGINT
  },
  nextDestination: {
    type: DataTypes.BIGINT
  },
  lastUpdate: {
    type: DataTypes.DATE
  },
  drection: {
    type: DataTypes.CHAR(1)
  },
  processingResult: {
    type: DataTypes.CHAR(1)
  },
  error: {
    type: DataTypes.STRING(255)
  }
}, {
  timestamps: false
});