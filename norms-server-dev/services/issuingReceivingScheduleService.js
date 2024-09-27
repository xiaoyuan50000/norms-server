const log = require('../winston/logger').logger('Issuing Receiving Schedule Service');
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf');
const { Op, QueryTypes } = require('sequelize');
const { IssuingReceivingSchedule } = require('../model/issuingReceivingScheduleModel');

const scheduleType = [100, 50, 10, 5, 2]
module.exports.InitIssuingReveivingScheduleTable = async function (req, res) {
    let { scheduledBy } = req.body
    let start = Number(req.body.start)
    let length = Number(req.body.page)

    let filterParams = {
        offset: start,
        limit: length
    }
    if (scheduledBy) {
        filterParams.where = {
            scheduleStatus: scheduledBy
        }
    }
    let { count, rows } = await IssuingReceivingSchedule.findAndCountAll(filterParams)
    return Response.success(res, rows, count)
}

module.exports.QueryIssuingReveivingScheduleChart = async function (req, res) {
    let { scheduledBy } = req.body
    let replacements = []
    let filter = ''
    if (scheduledBy) {
        filter += ` and scheduleStatus = ?`
        replacements.push(scheduledBy)
    }
    let rows = await sequelizeObj.query(
        `SELECT
            bank,
            SUM(newNotesAmount) AS newNotesAmountTotal,
            SUM(processedNotesAmount) AS processedNotesAmountTotal,
            SUM(newNotesAmount) - SUM(processedNotesAmount) as balance
        FROM
            issuing_receiving_schedule
        GROUP BY
            bank where 1=1 ${filter}`,
        {
            replacements: replacements,
            type: QueryTypes.SELECT,
        }
    )

    for (let row of rows) {
        let { bank, newNotesAmountTotal } = row

    }
}

const getScheduleByType = function (total) {
    scheduleType.forEach((value, index) => {
    })
}

const getQuotientAndRemainder = function (total, index) {
    let scheduleType = scheduleType[index]
    if (total < scheduleType) {
        return { schedule: 0, balance: total }
    }

    let schedule = Math.floor(total / scheduleType)
    let balance = total % scheduleType
    return { schedule: schedule, balance: balance }
}
