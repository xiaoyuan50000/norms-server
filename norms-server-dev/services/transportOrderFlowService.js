const { Destination } = require("../model/destination")
const { FlowStateModel } = require("../model/flowStateModel.js")
const { TransportOrderFlow } = require("../model/transportOrderFlow.js")
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { QueryTypes } = require('sequelize');

module.exports.InitTransportOrderFlowListTable = async function (req, res) {
  let flowId = req.body.flowId;
  // let toId = req.body.toId;
  // let namesList = []

  // let rows = await TransportOrderFlow.findAll({
  //   where: {
  //     flowId: flowId
  //   }
  // });

  // if (!rows || rows.length === 0 || (rows[0].detail == null || rows[0].detail === '')) {
  //   let fullPath = await sequelizeObj.query(
  //     `
  //     SELECT
  //       STUFF(
  //         (
  //         SELECT ',' + CAST ( source AS VARCHAR ( 10 ) ) 
  //         FROM
  //           (SELECT DISTINCT sourceDestination AS source 
  //           FROM
  //             flow_state 
  //           WHERE
  //             transportOrder = t1.transportOrder UNION
  //           SELECT DISTINCT
  //             nextDestination AS source 
  //           FROM
  //             flow_state                                  
  //           WHERE
  //             transportOrder = t1.transportOrder) AS distinct_sources 
  //         ORDER BY
  //           source FOR XML PATH ( '' ),TYPE).value ( '.', 'NVARCHAR(MAX)' ),1,1,'') AS concatenatedPath 
  //     FROM
  //       flow_state t1 
  //     WHERE
  //       transportOrder = :transportOrder
  //     GROUP BY
  //       t1.transportOrder;                                         
  //     `,
  //     {
  //       replacements: { transportOrder: toId },
  //       type: QueryTypes.SELECT
  //     }
  //   )

  //   if (fullPath && fullPath.length > 0) {
  //     let concatenatedPath = fullPath[0].concatenatedPath;
  //     if (concatenatedPath) {
  //       let ids = concatenatedPath.split(',').map(id => parseInt(id.trim(), 10));
  //       let destinationNames = await Destination.findAll({
  //         where: {
  //           id: {
  //             [Op.in]: ids
  //           }
  //         }
  //       });

  //       namesList = destinationNames.map(name => name.name).join(',');
  //     }
  //   }

  //   rows[0].path = namesList
  // }

  let rows = await sequelizeObj.query(
    `
     WITH SplitStrings AS (
      SELECT
        flowId,
        CAST ( SUBSTRING ( path + ',', 1, CHARINDEX( ',', path + ',', 1 ) - 1 ) AS INT ) AS ItemId,
        STUFF( path, 1, CHARINDEX( ',', path + ',', 1 ), '' ) AS Remaining 
      FROM
        transport_order_flow 
      WHERE
        flowId = :flowId UNION ALL
      SELECT
        flowId,
        CAST ( SUBSTRING ( Remaining, 1, CHARINDEX( ',', Remaining + ',', 1 ) - 1 ) AS INT ),
        STUFF( Remaining, 1, CHARINDEX( ',', Remaining + ',', 1 ), '' ) 
      FROM
        SplitStrings 
      WHERE
        Remaining > '' 
      ),
      OrderedItems AS ( SELECT flowId, ItemId, ROW_NUMBER ( ) OVER ( PARTITION BY flowId ORDER BY ( SELECT NULL ) ) AS ItemOrder FROM SplitStrings ) SELECT
      tof.flowId,
      STUFF(
        (
        SELECT
          ',' + d.name 
        FROM
          OrderedItems oi
          JOIN destination d ON oi.ItemId = d.id 
        WHERE
          oi.flowId = tof.flowId 
        ORDER BY
          oi.ItemOrder FOR XML PATH ( '' ) 
        ),
        1,
        1,
        '' 
      ) AS path,
      tof.detail,
      tof.time 
    FROM
      transport_order_flow tof 
    WHERE
      tof.flowId = :flowId;
    `,
    {
      replacements: { flowId: flowId },
      type: QueryTypes.SELECT
    }
  );

  return Response.success(res, rows);
};


module.exports.SaveDiagramData = async function (req, res) {
  const data = req.body.jsonData
  const flowId = req.body.flowId
  const transportOrder = req.body.toId
  const datasObject = JSON.parse(data);

  if (datasObject.nodeDataArray.length === 0) {
    const t = await sequelizeObj.transaction();

    try {
      await FlowStateModel.destroy({ where: { transportOrder: transportOrder }, transaction: t });

      let result = await sequelizeObj.query(
        `UPDATE transport_order_flow SET path = NULL,detail = NULL WHERE flowId = :flowId;`,
        {
          replacements: { flowId },
          type: QueryTypes.UPDATE,
          transaction: t
        }
      )

      await t.commit();
      return Response.success(res, result);
    } catch (error) {
      await t.rollback();
      console.error(error);
    }
  }

  const destinations = await Destination.findAll({ attributes: ['id', 'name'] });
  const existingOrder = await FlowStateModel.findAll({ where: { transportOrder: transportOrder } });

  const nameToIdMap = destinations.reduce((map, { id, name }) => {
    map[name] = id;
    return map;
  }, {});

  const nodeNames = datasObject.nodeDataArray.map(node => node.name);
  let path = nodeNames.map(name => nameToIdMap[name]).join(',');
  // name no null.
  if (!nodeNames.every(name => name in nameToIdMap)) {
    return Response.error(res, 'One or more node names do not have corresponding name in the database.', 404);
  }

  if (datasObject.nodeDataArray.length === 1 && datasObject.linkDataArray.length === 0) {
    const t = await sequelizeObj.transaction();

    try {
      await FlowStateModel.destroy({ where: { transportOrder: transportOrder }, transaction: t });

      let result = await sequelizeObj.query(
        `UPDATE transport_order_flow SET path = :path,detail = :data WHERE flowId = :flowId`,
        {
          replacements: { path, data, flowId },
          type: QueryTypes.UPDATE,
          transaction: t
        }
      )

      await t.commit();
      return Response.success(res, result);
    } catch (error) {
      await t.rollback();
      console.error(error);
    }
  }

  const linkRecords = datasObject.linkDataArray.map(link => {
    const fromName = datasObject.nodeDataArray.find(node => node.key === link.from).name;
    const toName = datasObject.nodeDataArray.find(node => node.key === link.to).name;
    return { from: fromName, to: toName };
  });

  const recordsToSave = linkRecords.map(({ from, to }) => {
    return {
      transportOrder: transportOrder,
      sourceDestination: nameToIdMap[from],
      nextDestination: nameToIdMap[to],
      lastUpdate: '1899-12-31 23:54:17.0000000',
      drection: 0,
      processingResult: 0,
      error: null
    };
  });

  function mergeRecordsToSaveWithExistingOrder(recordsToSave, existingOrder) {
    const mergedRecords = [];
    let isExistingRecordFound = true;

    for (let i = 0; i < recordsToSave.length; i++) {
      const newRecord = recordsToSave[i];

      if (isExistingRecordFound) {
        if (i < existingOrder.length) {
          for (i; i < existingOrder.length;) {
            const existingRecord = existingOrder[i];
            if (existingRecord.sourceDestination === newRecord.sourceDestination && existingRecord.nextDestination === newRecord.nextDestination) {
              mergedRecords.push(existingRecord);
              isExistingRecordFound = true;

              break;
            } else {
              mergedRecords.push(newRecord);
              isExistingRecordFound = false;

              break;
            }
          }
        } else {
          mergedRecords.push(newRecord);
          isExistingRecordFound = true;
        }
      } else {
        mergedRecords.push(newRecord);
      }
    }
    return mergedRecords;
  }

  if (existingOrder && existingOrder.length > 0) {
    const newDatas = mergeRecordsToSaveWithExistingOrder(recordsToSave, existingOrder);

    const formattedData = newDatas.map(item => {
      const lastUpdate = item.lastUpdate ? new Date(item.lastUpdate) : null;

      return {
        transportOrder: item.transportOrder,
        sourceDestination: item.sourceDestination,
        nextDestination: item.nextDestination,
        lastUpdate: lastUpdate,
        drection: item.drection,
        processingResult: item.processingResult,
        error: item.error || null,
      };
    });

    const t = await sequelizeObj.transaction();

    try {
      await FlowStateModel.destroy({ where: { transportOrder: transportOrder }, transaction: t });
      await FlowStateModel.bulkCreate(formattedData, { transaction: t });

      let result = await sequelizeObj.query(
        `UPDATE transport_order_flow SET path = :path,detail = :data WHERE flowId = :flowId`,
        {
          replacements: { path, data, flowId },
          type: QueryTypes.UPDATE,
          transaction: t
        }
      )

      await t.commit();
      return Response.success(res, result);
    } catch (error) {
      await t.rollback();
      console.error(error);
    }
  } else {
    const t = await sequelizeObj.transaction();

    try {
      await FlowStateModel.bulkCreate(recordsToSave, { transaction: t });

      let result = await sequelizeObj.query(
        `UPDATE transport_order_flow SET path = :path,detail = :data WHERE flowId = :flowId`,
        {
          replacements: { path, data, flowId },
          type: QueryTypes.UPDATE,
          transaction: t
        }
      )

      await t.commit();
      return Response.success(res, result);
    } catch (error) {
      await t.rollback();
      console.error(error);
    }
  }
}