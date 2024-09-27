const { DataTypes, DATE } = require("sequelize");
const dbConf = require("../db/dbConf");

module.exports.OrderPriceList = dbConf.sequelizeObj.define('order_price_list', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  trackingId: {
    type: DataTypes.STRING(100)
  },
  productName: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.STRING(50)
  },
  oplDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING(50)
  },
  price: {
    type: DataTypes.DECIMAL(18, 0)
  }
}, {
  timestamps: false
});