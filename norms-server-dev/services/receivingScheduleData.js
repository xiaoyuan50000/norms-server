const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const moment = require('moment')


async function updateDate(id) {
  let lastUpdatedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');

  await sequelizeObj.query(
    'UPDATE receiving_schedule SET lastUpdatedDate = ? WHERE rsId = ?',
    {
      type: QueryTypes.UPDATE,
      replacements: [lastUpdatedDate, id]
    }
  )
}


module.exports.getReceivingScheduleData = async function (req, res) {
  let rows = await sequelizeObj.query(
    `
      SELECT
        rs.rsId,
        rs.crsNumber,
        COUNT ( cr.rsId ) AS 'count',
        rs.action,
        rs.createdBy,
        rs.lastUpdatedDate 
      FROM
        receiving_schedule rs
        LEFT JOIN cartons_received cr ON rs.rsId = cr.rsId 
      GROUP BY
        rs.rsId,
        rs.crsNumber,
        rs.action,
        rs.createdBy,
        rs.lastUpdatedDate;
    `,
    {
      type: QueryTypes.SELECT,
    }
  )

  return Response.success(res, rows);
}


module.exports.getCartonsReceivedData = async function (req, res) {
  let { rsId } = req.body

  let rows = await sequelizeObj.query(
    `
      SELECT *
      FROM cartons_received
      WHERE rsId = ?
    `,
    {
      type: QueryTypes.SELECT,
      replacements: [rsId]
    }
  )

  return Response.success(res, rows);
}


module.exports.receivingScheduleAddTuNamber = async function (req, res) {
  let { id, newTuNumber, labelPrinter, irtMember1, irtMember2 } = req.body

  let lastUpdatedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');

  let data = await sequelizeObj.query(
    `SELECT * FROM cartons_received WHERE id = ?`,
    {
      type: QueryTypes.SELECT,
      replacements: [id]
    }
  );
  updateDate(data[0].rsId);


  let result = await sequelizeObj.query(
    'UPDATE cartons_received SET tuNumber = ?,lastUpdatedDate = ?,labelPrinter = ?,irtMember1 = ?,irtMember2 = ? WHERE id = ?',
    {
      type: QueryTypes.UPDATE,
      replacements: [newTuNumber, lastUpdatedDate, labelPrinter, irtMember1, irtMember2, id]
    }
  );

  return Response.success(res, result);
}


module.exports.receivingScheduleAddNewData = async function (req, res) {
  let { craneID, barcode, createdBy, maxWeight, minWeight, rsId, tuNumber, labelPrinter, irtMember1, irtMember2 } = req.body

  let lastUpdatedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');

  let result = await sequelizeObj.query(
    `
    INSERT INTO cartons_received
    (craneID, barcode, createdBy, maxWeight, minWeight, rsId, lastUpdatedDate, tuNumber, labelPrinter, irtMember1, irtMember2)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    {
      type: QueryTypes.INSERT,
      replacements: [craneID, barcode, createdBy, maxWeight, minWeight, rsId, lastUpdatedDate, tuNumber, labelPrinter, irtMember1, irtMember2]
    }
  );

  updateDate(rsId);

  return Response.success(res, result);
}


module.exports.getRsDetailedData = async function (req, res) {
  let { rsId } = req.body

  let rows = await sequelizeObj.query(
    `
      SELECT
          rs.rsId,
          rs.crsNumber,
          cr.id,
          cr.barcode,
          cr.minWeight,
          cr.maxWeight,
          cr.createdBy,
          cr.lastUpdatedDate
      FROM
          receiving_schedule rs
      INNER JOIN
          cartons_received cr ON rs.rsId = cr.rsId
      WHERE
          rs.rsId = ?                   
    `,
    {
      type: QueryTypes.SELECT,
      replacements: [rsId]
    }
  )

  return Response.success(res, rows);
}


module.exports.rsDeleteDetailData = async function (req, res) {
  let { id } = req.body

  let data = await sequelizeObj.query(
    `SELECT * FROM cartons_received WHERE id = ?`,
    {
      type: QueryTypes.SELECT,
      replacements: [id]
    }
  );
  console.log(data[0].rsId);
  updateDate(data[0].rsId);

  let result = await sequelizeObj.query(
    `DELETE FROM cartons_received WHERE id = ?`,
    {
      type: QueryTypes.DEL,
      replacements: [id]
    }
  );

  return Response.success(res, result);
}


module.exports.saveReceivingScheduleData = async function (req, res) {
  let { crsNumber, action, createdBy, lastUpdatedDate } = req.body

  let UpdatedDate = moment(new Date(lastUpdatedDate)).format('YYYY-MM-DD HH:mm:ss.SSS');

  let result = await sequelizeObj.query(
    `
    INSERT INTO receiving_schedule
    (crsNumber, action, createdBy, lastUpdatedDate)
    VALUES
    (?, ?, ?, ?)
    `,
    {
      type: QueryTypes.INSERT,
      replacements: [crsNumber, action, createdBy, UpdatedDate]
    }
  );

  return Response.success(res, result);
}


// module.exports.receivingScheduleCoordinateUpdating = async function (req, res) {
//   let { TuNumber, locationX, locationY, locationZ } = req.body

//   let lastUpdatedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');

//   let result = await sequelizeObj.query(
//     'UPDATE receiving_schedule SET locationX = ?,locationY = ?,locationZ = ?,lastUpdatedDate = ? WHERE tuNumber = ?'
//     ,
//     {
//       type: QueryTypes.UPDATE,
//       replacements: [locationX, locationY, locationZ, lastUpdatedDate, TuNumber]
//     }
//   );

//   return Response.success(res, result);
// }