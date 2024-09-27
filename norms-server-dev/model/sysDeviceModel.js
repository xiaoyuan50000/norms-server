const { DataTypes, DATE } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.SysDevice = dbConf.sequelizeObj.define('sys_device', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200)
  },
  status: {
    type: DataTypes.STRING(255)
  },
  type: {
    type: DataTypes.STRING(255)
  },
  updateDate: {
    type: DataTypes.BIGINT
  },
  updateUserId: {
    type: DataTypes.BIGINT
  },
  operateStatus: {
    type: DataTypes.STRING(255)
  },
  isError: {
    type: DataTypes.INTEGER
  },
  errorInfo: {
    type: DataTypes.STRING(500)
  },
  errorDate: {
    type: DataTypes.BIGINT
  },
  activationCode: {
    type: DataTypes.STRING(255)
  }
}, {
  timestamps: false
});