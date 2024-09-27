const { TransportOrder } = require("../model/transportOrder.js")
const Response = require('../util/response.js');

module.exports.InitTransportOrderListTable = async function (req, res) {
  let start = Number(req.body.start)
  let length = Number(req.body.page)

  let filterParams = {
    offset: start,
    limit: length
  }

  let { count, rows } = await TransportOrder.findAndCountAll(filterParams)
  
  return Response.success(res, rows, count)
}