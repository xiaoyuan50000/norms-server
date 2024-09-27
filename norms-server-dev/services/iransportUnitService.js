const { Op, QueryTypes, where } = require("sequelize");
const { IransportUnit } = require("../model/iransportUnitModel")
const { sequelizeObj } = require('../db/dbConf');
const Response = require('../util/response.js');


module.exports.InitTransportUnitTable = async function (req, res) {
  let start = Number(req.body.start)
  let length = Number(req.body.page)

  const { transportOrder, lastUpdate, sourceDestination, nextDestination, error, description } = req.body

  let newSelect = {
    where: {},
    offset: start,
    limit: length
  }

  if (transportOrder) {
    newSelect.where.transportOrder = transportOrder
  }
  if (lastUpdate) {
    newSelect.where["[Op.and]"] = sequelizeObj.literal(`DATE_FORMAT(lastUpdate, '%Y-%m-%d') = '${lastUpdate}'`)
  }
  if (sourceDestination) {
    newSelect.where.sourceDestination = sourceDestination
  }
  if (nextDestination) {
    newSelect.where.nextDestination = nextDestination
  }
  if (error) {
    newSelect.where.error = error
  }
  if (description) {
    newSelect.where.description = {
      [Op.like]: `%${description}%`
    }
  }

  let { count, rows } = await IransportUnit.findAndCountAll(newSelect)
  return Response.success(res, rows, count)
}