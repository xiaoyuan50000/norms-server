const { DataTypes, DATE } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.ApiKeyList = dbConf.sequelizeObj.define('api_key_list', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  otGateway: {
    type: DataTypes.STRING(200)
  },
  apiKey: {
    type: DataTypes.STRING(1000)
  },
  oplDate: {
    type: DataTypes.BIGINT
  },
  updateDate: {
    type: DataTypes.BIGINT
  },
  alias: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.INTEGER
  },
  uri: {
    type: DataTypes.STRING(255)
  },
  token: {
    type: DataTypes.STRING(600)
  },
  aesApiKey: {
    type: DataTypes.STRING(500)
  },
  encreptKey: {
    type: DataTypes.STRING(500)
  },
}, {
  timestamps: false
});