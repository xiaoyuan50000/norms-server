const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const { SysDevice } = require("../model/sysDeviceModel")


module.exports.getTogglingPageData = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT * FROM sys_device where 1=1`,
    {
      type: QueryTypes.SELECT,
    }
  )

  return Response.success(res, rows);
}

module.exports.updateTogglingPage = async function (req, res) {
  let { name, newStatus, activationCode } = req.body

  let curTime = new Date().getTime();
  let updateParam = { updateDate: curTime }

  if (newStatus) {
    updateParam.status = newStatus;
  }

  if (activationCode) {
    updateParam.status = 'Online';
    updateParam.activationCode = activationCode;
  }

  let rows = await SysDevice.update(updateParam, { where: { name } });
  return Response.success(res, rows);
}