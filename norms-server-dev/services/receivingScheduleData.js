const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const { ReceivingSchedule } = require("../model/receivingScheduleModel")
const moment = require('moment')


module.exports.getReceivingScheduleData = async function (req, res) {
  let rows = await sequelizeObj.query(
    `
      SELECT crsNumber,COUNT(crsNumber) countCrsNumber,action,createdBy,MAX(lastUpdatedDate) maxLastUpdatedDate
      FROM receiving_schedule
      GROUP BY crsNumber,action,createdBy
    `,
    {
      type: QueryTypes.SELECT,
    }
  )

  return Response.success(res, rows);
}


module.exports.getCartonsReceivedData = async function (req, res) {
  let { crsNumber } = req.body

  let rows = await sequelizeObj.query(
    `
    SELECT *
    From receiving_schedule 
    WHERE crsNumber = ?
    `,
    {
      type: QueryTypes.SELECT,
      replacements: [crsNumber]
    }
  )

  return Response.success(res, rows);
}

module.exports.receivingScheduleAddTuNamber = async function (req, res) {
  let { id, newTuNumber, labelPrinter, irtMember1, irtMember2 } = req.body

  let lastUpdatedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');

  let result = await sequelizeObj.query(
    'UPDATE receiving_schedule SET tuNumber = ?,lastUpdatedDate = ?,labelPrinter = ?,irtMember1 = ?,irtMember2 = ? WHERE id = ?',
    {
      type: QueryTypes.UPDATE,
      replacements: [newTuNumber, lastUpdatedDate, labelPrinter, irtMember1, irtMember2, id]
    }
  );

  return Response.success(res, result);
}

module.exports.receivingScheduleAddNewData = async function (req, res) {
  let { crsNumber, action, createdBy, barcode, minWeight, maxWeight, tuNumber, craneID, labelPrinter, irtMember1, irtMember2 } = req.body

  let lastUpdatedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');

  let result = await sequelizeObj.query(
    `
    INSERT INTO receiving_schedule
    (crsNumber, action, createdBy, lastUpdatedDate, barcode, minWeight, maxWeight, tuNumber, craneID, labelPrinter, irtMember1, irtMember2)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    {
      type: QueryTypes.INSERT,
      replacements: [crsNumber, action, createdBy, lastUpdatedDate, barcode, minWeight, maxWeight, tuNumber, craneID, labelPrinter, irtMember1, irtMember2]
    }
  );

  return Response.success(res, result);
}

module.exports.getRsDetailedData = async function (req, res) {
  let { crsNumber } = req.body

  let rows = await sequelizeObj.query(
    `SELECT * FROM receiving_schedule WHERE crsNumber = ?`,
    {
      type: QueryTypes.SELECT,
      replacements: [crsNumber]
    }
  )

  return Response.success(res, rows);
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