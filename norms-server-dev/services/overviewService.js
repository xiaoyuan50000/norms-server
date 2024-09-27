const { Op, QueryTypes, where } = require("sequelize");
const { Overview } = require("../model/overviewModel")
const { sequelizeObj } = require('../db/dbConf');
const Response = require('../util/response.js');

module.exports.InitStorageCapacityStatus = async function (req, res) {
  let rows = await sequelizeObj.query(
    `select source,COUNT(source) AS source_count
    from overview
    GROUP BY source`,
    {
      type: QueryTypes.SELECT
    }
  )
  return Response.success(res, rows)
}


module.exports.InitIssuingStatus = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT issuingStatus,COUNT(issuingStatus)  AS 'rs_count'
    FROM overview
    GROUP BY issuingStatus;`,
    {
      type: QueryTypes.SELECT,
    }
  )
  return Response.success(res, rows)
}

module.exports.InitReceivingStatus = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT receivingStatus,COUNT(receivingStatus)  AS 'rs_count'
    FROM overview
    GROUP BY receivingStatus;`,
    {
      type: QueryTypes.SELECT,
    }
  )
  return Response.success(res, rows)
}

module.exports.InitDrawTable = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT tunr,errorMsg,source,dest,createdDate
    FROM overview
    WHERE errorMsg is NOT NULL;`,
    {
      type: QueryTypes.SELECT,
    }
  )
  return Response.success(res, rows)
}

module.exports.InitNpm1Status = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT product, npmStatus, sum(amount) AS amount_sum
    FROM overview
    where npm = 'NPM1'
    GROUP BY product, npmStatus`,
    {
      type: QueryTypes.SELECT
    }
  )
  return Response.success(res, rows)
}

module.exports.InitNpm2Status = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT product, npmStatus, sum(amount) AS amount_sum
    FROM overview
    where npm = 'NPM2'
    GROUP BY product, npmStatus`,
    {
      type: QueryTypes.SELECT
    }
  )
  return Response.success(res, rows)
}

module.exports.InitNpm3Status = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT product, npmStatus, sum(amount) AS amount_sum
    FROM overview
    where npm = 'NPM3'
    GROUP BY product, npmStatus`,
    {
      type: QueryTypes.SELECT
    }
  )
  return Response.success(res, rows)
}

module.exports.InitNpm4Status = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT product, npmStatus, sum(amount) AS amount_sum
    FROM overview
    where npm = 'NPM4'
    GROUP BY product, npmStatus`,
    {
      type: QueryTypes.SELECT
    }
  )
  return Response.success(res, rows)
}