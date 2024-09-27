const { DataTypes } = require('sequelize');
const dbConf = require('../db/dbConf');
const { formatCurrency, formatNumber } = require('../util/utils');
const moment = require('moment')

module.exports.IssuingReceivingSchedule = dbConf.sequelizeObj.define('issuing_receiving_schedule', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    bank: {
        type: DataTypes.STRING(150),
    },
    location: {
        type: DataTypes.STRING(255),
    },
    product: {
        type: DataTypes.STRING(100),
    },
    newNotes: {
        type: DataTypes.DECIMAL(10, 0)
    },
    newNotesAmount: {
        type: DataTypes.DECIMAL(10, 0)
    },
    processedNotes: {
        type: DataTypes.DECIMAL(10, 0)
    },
    processedNotesAmount: {
        type: DataTypes.DECIMAL(10, 0)
    },
    issueDate: {
        type: DataTypes.DATEONLY
    },
    scheduleStatus: {
        type: DataTypes.STRING(55),
    },
    newNotesFormat: {
        type: DataTypes.VIRTUAL,
        get() {
            let value = this.getDataValue('newNotes');
            return formatNumber(value)
        }

    },
    newNotesAmountFormat: {
        type: DataTypes.VIRTUAL,
        get() {
            let value = this.getDataValue('newNotesAmount');
            return formatCurrency(value)
        }
    },
    processedNotesFormat: {
        type: DataTypes.VIRTUAL,
        get() {
            let value = this.getDataValue('processedNotes');
            return formatNumber(value)
        }
    },
    processedNotesAmountFormat: {
        type: DataTypes.VIRTUAL,
        get() {
            let value = this.getDataValue('processedNotesAmount');
            return formatCurrency(value)
        }
    },
    issueDateFormat: {
        type: DataTypes.VIRTUAL,
        get() {
            let value = this.getDataValue('issueDate');
            return moment(value).format('DD MMM YY')
        }
    },
}, {
    timestamps: false,
});