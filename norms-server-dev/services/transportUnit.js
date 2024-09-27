const { TransportUnit } = require("../model/transportUnit")
const Response = require('../util/response.js');

module.exports.InitTransportUnitListTable = async function (req, res) {
  let start = Number(req.body.start)
  let length = Number(req.body.page)

  let filterParams = {
    offset: start,
    limit: length
  }

  let { count, rows } = await TransportUnit.findAndCountAll(filterParams)
  
  return Response.success(res, rows, count)
}