const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.Storage = dbConf.sequelizeObj.define('overview_data', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  issuingStatus: {
    type: DataTypes.TEXT
  },
  receivingStatus: {
    type: DataTypes.TEXT
  },
  noteProcessingStatus: {
    type: DataTypes.TEXT
  },
  bulkLaneStatus: {
    type: DataTypes.TEXT
  },
  teamStatus: {
    type: DataTypes.TEXT
  },
  subsystemStatus: {
    type: DataTypes.TEXT
  },
  storageCapacityStatus: {
    type: DataTypes.TEXT
  },
  transportErrors: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
});