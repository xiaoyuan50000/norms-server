const log = require('../winston/logger').logger('Transport Order Issues Service');
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf');
const { Op, QueryTypes, where } = require('sequelize');
const { TransportOrderIssues } = require('../model/transportOrderIssuesModel.js');

module.exports.InitTransportOrderIssuesTable = async function (req, res) {
  let start = Number(req.body.start)
  let length = Number(req.body.page)

  const { tuNr, updatedTime, agvName } = req.body

  let newSelect = {
    where: {},
    offset: start,
    limit: length
  }
  if (tuNr) {
    newSelect.where.tuNr = tuNr
  }
  if (updatedTime) {
    newSelect.where["[Op.and]"] = sequelizeObj.literal(`DATE_FORMAT(updatedTime, '%Y-%m-%d') = '${updatedTime}'`)
  }
  if (agvName) {
    newSelect.where.agvName = agvName
  }

  let { count, rows } = await TransportOrderIssues.findAndCountAll(newSelect)
  return Response.success(res, rows, count)
}


module.exports.InitTransportOrderIssuesStatistic = async function (req, res) {
  const result = [
    { agvName: 'AGV 1', activeNum: 0, pendingNum: 0, completedNum: 0, total: 0 },
    { agvName: 'AGV 2', activeNum: 0, pendingNum: 0, completedNum: 0, total: 0 },
    { agvName: 'AGV 3', activeNum: 0, pendingNum: 0, completedNum: 0, total: 0 },
    { agvName: 'AGV 4', activeNum: 0, pendingNum: 0, completedNum: 0, total: 0 },
    { agvName: 'Vault door', activeNum: 0, pendingNum: 0, completedNum: 0, total: 0, open:true }
  ]
  const { tuNr, updatedTime, agvName } = req.body

  let filter = ""
  let replacements = []
  if (tuNr) {
    filter += ` and tuNr=?`
    replacements.push(tuNr)
  }
  if (updatedTime) {
    filter += ` and DATE_FORMAT(updatedTime, '%Y-%m-%d')=?`
    replacements.push(updatedTime)
  }
  if (agvName) {
    filter += ` and agvName=?`
    replacements.push(agvName)
  }

  let rows = await sequelizeObj.query(
    `SELECT     
          agvName,
          SUM(CASE WHEN agvStatus = 'active' THEN 1 ELSE 0 END) AS active_count,
          SUM(CASE WHEN agvStatus = 'pending' THEN 1 ELSE 0 END) AS pending_count,
          SUM(CASE WHEN agvStatus = 'completed' THEN 1 ELSE 0 END) AS completed_count,
          COUNT(*) AS total_count    
        FROM     
          transport_order_issues
          where 1=1  ${filter}
        GROUP BY agvName`,
    {
      replacements: replacements,
      type: QueryTypes.SELECT
    }
  )
  result.forEach((item, index) => {
    let agvName = item.agvName
    let row = rows.find(o => o.agvName == agvName)
    if (row) {
      item.activeNum = row.active_count
      item.pendingNum = row.pending_count
      item.completedNum = row.completed_count
      item.total = row.total_count
    }
  })
  return Response.success(res, result)

}