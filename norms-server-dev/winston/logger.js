const { createLogger, format, transports } = require('winston');
require('dotenv').config();
let path = require('path')
require("winston-daily-rotate-file");

const dateFileConfig = {
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "1d",
};

const customFilePrintFormat = function (label = '', ifConsole = false) {
    return format.combine(
        format.label({ label }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.printf((i) => {
            if (ifConsole) {
                return format.colorize().colorize(i.level, `[${i.timestamp}] [${i.level.toString().toUpperCase()}] ${i.label} - `) + i.message
            } else {
                return `[${i.timestamp}] [${i.level.toString().toUpperCase()}] ${i.label} ${i.message}`
            }
            
        }),
    );
}

const fileLogger = function (label) {
    const LOG_PATH = process.env.LOG_PATH
    return createLogger({
        format: customFilePrintFormat(label),
        transports: [
            new transports.DailyRotateFile({
                level: 'info',
                filename: path.resolve(LOG_PATH, "info/info.%DATE%.log"),
                ...dateFileConfig
            }),
            new transports.DailyRotateFile({
                level: 'error',
                filename: path.resolve(LOG_PATH, "error/error.%DATE%.log"),
                ...dateFileConfig
            }),
            new transports.Console({
                format: customFilePrintFormat(label, true),
            })
        ]
    });
}

module.exports = {
    logger: function (target) {
        let log = fileLogger(target);
        return {
            info: function (...str) {
                log.info(str.join(' '))
            },
            warn: function (...str) {
                log.warn(str.join(' '))
            },
            error: function (...str) {
                log.error(str.join(' '))
                if (str[0].stack) {
                    log.error(str[0].stack)
                }
                if (str.length > 1) {
                    log.error(str[1].stack)
                }
            },
            debug: function (...str) {
                log.debug(str.join(' '))
            }
        }
    }
};