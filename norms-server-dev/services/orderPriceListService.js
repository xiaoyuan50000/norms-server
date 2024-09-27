const { Op, QueryTypes, where } = require("sequelize");
const { OrderPriceList } = require("../model/orderPriceListModel")
const { sequelizeObj } = require('../db/dbConf');
const Response = require('../util/response.js');
const { log } = require("winston");
const moment = require('moment');

module.exports.InitStatisticsStatus = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT 
        COUNT( * ) AS total_order,
        SUM ( price ) AS total_sales,
        COUNT ( CASE WHEN status = 'Pending' THEN 1 END ) AS total_pending 
      FROM
        order_price_list`,
    {
      type: QueryTypes.SELECT
    }
  )
  return Response.success(res, rows)
}

module.exports.InitSalesDetailsStatus = async function (req, res) {
  let dateParam = '';
  if (req.body.data !== null && req.body.data !== 0 && req.body.data !== '') {
    dateParam = new Date(req.body.data);
  } else {
    dateParam = new Date();
  }

  let startDate = new Date(dateParam.getTime() - (14 * 24 * 60 * 60 * 1000));
  let endDate = new Date(dateParam.getTime());

  function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(`${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`);
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dates;
  }

  const dates = getDatesInRange(startDate, endDate); 
  const results = dates.map(dateStr => ({
    OrderDate: dateStr,
    Amount: 0
  }));

  const newStartDate = moment(startDate).format('YYYY-MM-DD');
  const newEndDate = moment(endDate).format('YYYY-MM-DD');

  let rows = await sequelizeObj.query(
    `SELECT
          FORMAT(oplDate, 'MM-dd') AS OrderDate,
          SUM(price) AS Amount
      FROM
          order_price_list
      WHERE
          FORMAT(oplDate, 'yyyy-MM-dd') >= ?
          AND FORMAT(oplDate, 'yyyy-MM-dd') <= ?
      GROUP BY
          FORMAT(oplDate, 'MM-dd')
      ORDER BY
          MIN(oplDate) DESC`,
    {
      replacements: [newStartDate, newEndDate],
      type: QueryTypes.SELECT
    }
  );

  rows.forEach(row => {
    const index = results.findIndex(item => item.OrderDate === row.OrderDate);
    if (index !== -1) {
      results[index].Amount = row.Amount;
    }
  });

  return Response.success(res, results);
}

module.exports.InitOrderPriceListTable = async function (req, res) {
  let start = Number(req.body.start)
  let length = Number(req.body.page)

  let { count, rows } = await OrderPriceList.findAndCountAll({
    order: [['oplDate', 'DESC']],
    offset: start,
    limit: length,
    attributes: ['trackingId', 'productName', 'address', 'oplDate', 'status', 'price']
  });

  return Response.success(res, rows, count)
}

module.exports.InitProductDetailsStatus = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT status,COUNT(status) AS status_count
    FROM order_price_list
    GROUP BY status`,
    {
      type: QueryTypes.SELECT
    }
  )

  return Response.success(res, rows)
}

module.exports.IniAnalyticsDataStatus = async function (req, res) {
  let rows = await sequelizeObj.query(
    `SELECT       
        FORMAT(CONVERT(DATE, oplDate), 'MM-dd') AS OrderDate,   
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS PendingOrders,      
        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS NewOrders,      
        SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS DeliveredOrders      
    FROM       
        order_price_list      
    WHERE       
        oplDate >= DATEADD(DAY, -6, CAST(GETDATE() AS DATE)) AND oplDate < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))  
    GROUP BY       
        CONVERT(DATE, oplDate)    
    ORDER BY       
        CONVERT(DATE, oplDate) DESC;`,
    {
      type: QueryTypes.SELECT
    }
  )

  function getDatesFromTodayToSixDaysBefore() {
    const today = new Date();
    const dates = [];

    for (let i = 0; i <= 6; i++) {
      const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));

      const dateString = `${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      dates.push(dateString);
    }
    return dates;
  }

  const dates = getDatesFromTodayToSixDaysBefore(); 
  const results = dates.map(dateStr => ({
    OrderDate: dateStr,
    PendingOrders: 0,
    DeliveredOrders: 0,
    NewOrders: 0
  }));

  rows.forEach(row => {
    const index = results.findIndex(item => item.OrderDate === row.OrderDate);
    if (index !== -1) {
      results[index] = {
        ...results[index],
        PendingOrders: row.PendingOrders,
        NewOrders: row.NewOrders,
        DeliveredOrders: row.DeliveredOrders,
      };
    }
  });

  return Response.success(res, results)
}

