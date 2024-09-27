const { FlowStateModel } = require("../model/flowStateModel")
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');

module.exports.getFlowStateTable = async function (req, res) {
  let start = Number(req.body.start)
  let length = Number(req.body.page)
  let toId = req.body.toId;

  let total_count = await sequelizeObj.query(
    `SELECT COUNT(*) AS total_count 
     FROM flow_state f
     WHERE f.transportOrder = :toId`,
    {
      replacements: { toId: toId },
      type: QueryTypes.SELECT
    }
  );

  total_count = total_count[0].total_count;

  let rows = await sequelizeObj.query(
    `
    SELECT 
        fs.id,
        d.name AS sourceDestination,
        d2.name AS nextDestination,
        fs.lastUpdate,
        fs.drection,
        fs.processingResult,
        fs.error
    FROM 
        flow_state AS fs
    JOIN 
        destination AS d ON fs.sourceDestination = d.id
    JOIN 
        destination AS d2 ON fs.nextDestination = d2.id
    WHERE
      fs.transportOrder = :toId
    ORDER BY fs.id ASC 
    OFFSET :offsetValue ROWS FETCH NEXT :fetchValue ROWS ONLY;
    `,
    {
      replacements: { toId: toId, offsetValue: start, fetchValue: length },
      type: QueryTypes.SELECT
    }
  );

  return Response.success(res, rows, total_count)
};