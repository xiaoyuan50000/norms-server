const { DataTypes } = require('sequelize');
const dbConf = require('../db/dbConf');
const moment = require('moment')

module.exports.TransportOrderIssues = dbConf.sequelizeObj.define('transport_order_issues', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  tuNr: {
    type: DataTypes.STRING(150),
  },
  st: {
    type: DataTypes.STRING(10),
  },
  ty: {
    type: DataTypes.STRING(10),
  },
  sourceMod: {
    type: DataTypes.STRING(50),
  },
  sourceRack: {
    type: DataTypes.STRING(50),
  },
  sourceX: {
    type: DataTypes.STRING(50),
  },
  sourceY: {
    type: DataTypes.STRING(50),
  },
  sourceDep: {
    type: DataTypes.STRING(50),
  },
  destinationMod: {
    type: DataTypes.STRING(50),
  },
  destinationRack: {
    type: DataTypes.STRING(50),
  },
  destinationX: {
    type: DataTypes.STRING(50),
  },
  destinationY: {
    type: DataTypes.STRING(50),
  },
  destinationDep: {
    type: DataTypes.STRING(50),
  },
  imageInfoLast: {
    type: DataTypes.STRING(50),
  },
  imageInfoCurrent: {
    type: DataTypes.STRING(50),
  },
  imageInfoInwait: {
    type: DataTypes.STRING(50),
  },
  imageInfoNext: {
    type: DataTypes.STRING(50),
  },
  agvName: {
    type: DataTypes.STRING(50),
  },
  agvStatus: {
    type: DataTypes.STRING(50),
  },
  updatedTime: {
    type: DataTypes.DATE,
  },
  doorName: {
    type: DataTypes.STRING(100),
  },
  doorStatus: {
    type: DataTypes.STRING(10),
  },
  updatedTimeFormat: {
    type: DataTypes.VIRTUAL,
    get() {
      return moment(this.updatedTime).format('DD.MM. HH:mm:ss')
    }

  }
}, {
  timestamps: false,
});