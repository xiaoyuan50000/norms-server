const { sequelizeObj, sequelizeObj2 } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const { Storage } = require("../model/storage")

const handlerOverView = async function () {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let issuinggData = [
    { name: 'Notification', num: 0, details: getDetails() },
    { name: 'Ready For Picking', num: 0, details: getDetails() },
    { name: 'Picking Activated', num: 0, details: getDetails() },
    { name: 'Ready For Issue', num: 0, details: getDetails() },
    { name: 'lssuing', num: 0, details: getDetails() },
    { name: 'Partially Completed', num: 0, details: getDetails() },
    { name: 'lssuing Completed', num: 0, details: getDetails() },
  ]
  let issStatus = await sequelizeObj2.query(
    `
      SELECT status AS "name", COUNT(*) AS "num" 
      FROM Issuing_Notification 
      WHERE CONVERT(DATE, NotifyDate) = CONVERT(DATE, :todayStart)
      GROUP BY status
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        todayStart: todayStart
      }
    }
  )
  issuinggData = issuinggData.map(item => {
    const statusData = issStatus.find(e => e.name === item.name);
    if (statusData) {
      return { ...item, num: statusData.num };
    }
    return item;
  });
  await updateOrCreate('issuingStatus', issuinggData);

  let receivingData = [
    { name: 'Notification', num: 0, details: getDetails() },
    { name: 'Ready To Receive', num: 0, details: getDetails() },
    { name: 'Receiving', num: 0, details: getDetails() },
    { name: 'Receiving Completed', num: 0, details: getDetails() },
    { name: 'lssuing Conmpleted', num: 0, details: getDetails() },
  ]
  let recStatus = await sequelizeObj2.query(
    `
      SELECT status AS "name", COUNT(*) AS "num" 
      FROM Receiving_Notification 
      WHERE CONVERT(DATE, NotifyDate) = CONVERT(DATE, :todayStart)
      GROUP BY status
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        todayStart: todayStart
      }
    }
  )
  receivingData = receivingData.map(item => {
    const statusData = recStatus.find(e => e.name === item.name);
    if (statusData) {
      return { ...item, num: statusData.num };
    }
    return item;
  });
  await updateOrCreate('receivingStatus', receivingData);


  let bulkLaneData = [
    { name: 'Issuing', Outstanding: 0, Completed: 0, details: getDetails() },
    { name: 'Receiving', Outstanding: 0, Completed: 0, details: getDetails() },
    { name: 'Audit', Outstanding: 0, Completed: 0, details: getDetails() },
  ]
  let bulkLaneStatus = await sequelizeObj2.query(
    `
      SELECT status AS "name", COUNT(*) AS "num" 
      FROM DTS_New_Notes_Receiving_Notification 
      WHERE CONVERT(DATE, AddDate) = CONVERT(DATE, :todayStart)
      GROUP BY status
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        todayStart: todayStart
      }
    }
  )
  if (bulkLaneStatus.length > 0) {
    const firstStatus = bulkLaneStatus[1];
    bulkLaneData[1].Outstanding = firstStatus.num;
    bulkLaneData[1].Completed = firstStatus.num;
  }
  await updateOrCreate('bulkLaneStatus', bulkLaneData);


  let noteProcessingData = []
  let noteProcessingStatus = await sequelizeObj.query(
    `SELECT * FROM note_processing_status where 1=1`,
    {
      type: QueryTypes.SELECT,
    }
  )
  noteProcessingStatus && noteProcessingStatus.forEach(e => {
    let data = {}
    data['name'] = e.name
    data['num'] = e.num
    data['status'] = e.status
    data['details'] = getDetails()
    noteProcessingData.push(data);
  })
  await updateOrCreate('noteProcessingStatus', noteProcessingData);

  let subsystemData = []
  let subsystemStatus = await sequelizeObj.query(
    `SELECT * FROM subsystem_status where 1=1`,
    {
      type: QueryTypes.SELECT,
    }
  )
  subsystemStatus && subsystemStatus.forEach(e => {
    let data = {}
    data['name'] = e.name
    data['num'] = e.remaining
    data['status'] = e.status
    data['operation'] = e.operation
    // data['details'] = getDetails()
    subsystemData.push(data);
  })
  await updateOrCreate('subsystemStatus', subsystemData);

}
module.exports.handlerOverView = handlerOverView


async function updateOrCreate(field, data) {
  let obj = {}
  obj[field] = JSON.stringify(data)
  let [overview] = await sequelizeObj.query(
    `SELECT * FROM overview_data where 1=1`,
    {
      type: QueryTypes.SELECT,
    }
  )
  if (overview) {
    await Storage.update(obj, { where: { id: overview.id } })
  } else {
    obj['id'] = 1
    await Storage.create(obj)
  }
}

function getDetails() {
  return [
    { "Bank": "DBS", "Courier": "CISCO", "Amount": "$200000", "Receive Date": "21/May/2024", "Notified Date": "20/May/2024" },
    { "Bank": "OCBC", "Courier": "CISCO", "Amount": "$300000", "Receive Date": "21/May/2024", "Notified Date": "20/May/2024" }
  ]
}