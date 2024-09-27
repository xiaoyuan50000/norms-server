const log = require('../winston/logger.js').logger('mapDeviceService');
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const { SysDevice } = require("../model/sysDeviceModel")


module.exports.getDevices = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT * FROM sys_device where 1=1`,
    {
      type: QueryTypes.SELECT,
    }
  )

  return Response.success(res, rows)
}

module.exports.updateStatus = async function (req, res) {
  console.log(req.body)

  if (!req.body.param) {
    return Response.error(res, "Please send the param to the body!")
  }

  let { name, status, isError, operateStatus,errorInfo } = req.body.param;

  let [device] = await sequelizeObj.query(
    `SELECT * FROM sys_device where name='${name}'`,
    {
      type: QueryTypes.SELECT,
    }
  )

  if (!device) {
    return Response.error(res, "The device name does not exist")
  }

  let curTime = new Date().getTime();
  let updateParam = { updateDate: curTime }

  if (status) {
    updateParam.status = status;
  }

  if (isError !== null && isError !== undefined && isError !== '') {
    updateParam.isError = isError;
  }

  if (errorInfo) {
    updateParam.errorInfo = errorInfo;
    updateParam.errorDate = curTime;
  }

  if (operateStatus) {
    updateParam.operateStatus = operateStatus;
  }

  await SysDevice.update(updateParam, { where: { name } })
  return Response.success(res, 'success')
}

module.exports.updateAllStatus = async function (req, res) {
  let status = req.body.status

  if (status) {
    status = 'Online'
  } else {
    status = 'Offline'
  }

  try {
    const result = await sequelizeObj.query(
      `UPDATE sys_device SET status = '${status}'`,
      {
        type: QueryTypes.UPDATE,
      }
    )

    return Response.success(res, result)
  } catch (error) {
    throw error;
  }
};
