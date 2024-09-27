const log = require('../winston/logger').logger('testService');
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf');
const { Op, QueryTypes } = require('sequelize');

module.exports.Test = async function (req, res) {
    let rows = await sequelizeObj.query(
        `SELECT * FROM transport_order_issues;`,
        {
            type: QueryTypes.SELECT,
        }
    )
    return Response.success(res, rows)
}