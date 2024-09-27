const { DataTypes } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.Destination = dbConf.sequelizeObj.define('destination', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100)
  }
}, {
  timestamps: false
});