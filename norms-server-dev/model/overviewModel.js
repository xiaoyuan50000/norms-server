const { DataTypes, DATE } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.Overview = dbConf.sequelizeObj.define('overview', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  tunr: {
    type: DataTypes.STRING(50)
  },
  source: {
    type: DataTypes.STRING(10)
  },
  npm: {
    type: DataTypes.STRING(10)
  },
  product: {
    type: DataTypes.STRING(255)
  },
  amount: {
    type: DataTypes.DECIMAL(18, 0)
  },
  issuingStatus: {
    type: DataTypes.STRING(30)
  },
  receivingStatus: {
    type: DataTypes.STRING(30)
  },
  npmStatus: {
    type: DataTypes.STRING(30)
  },
  dest: {
    type: DataTypes.STRING(10)
  },
  errorMsg: {
    type: DataTypes.STRING(255)
  },
  createdDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: false
});