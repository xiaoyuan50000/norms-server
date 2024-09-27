const log = require('../winston/logger').logger('DB');
require('dotenv').config();

const { Sequelize } = require('sequelize');
const createNamespace = require('cls-hooked').createNamespace;
const transportNamespace = createNamespace('norms');
Sequelize.useCLS(transportNamespace);

const dbConf = {
  database: process.env.DB_DATABASE,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT)
}

// let sequelizeObj = new Sequelize(dbConf.database, dbConf.user, dbConf.password, {
//     host: dbConf.host,
//     dialect: 'mssql',
//     logging: msg => {
//         console.log(msg)
//         log.info(msg)
//     },
//     define: {
//         freezeTableName: true
//     },
//     pool: {
//         max: dbConf.connectionLimit,
//         min: 0,
//         acquire: 100*1000,
//         idle: 10000
//     },
// 	timezone: '+08:00'
// });
let sequelizeObj = new Sequelize({
  database: dbConf.database,
  port: dbConf.port,
  dialect: 'mssql',
  dialectModulePath: 'msnodesqlv8/lib/sequelize',
  dialectOptions: {
    options: {
      driver: 'ODBC Driver 17 for SQL Server',
      trustedConnection: true,
      // connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=mimi;Trusted_Connection=yes;',
    }
  },
  logQueryParameters: true,
  logging: msg => {
    console.log(msg)
    log.info(msg)
  },
  define: {
    freezeTableName: true
  },
  pool: {
    max: dbConf.connectionLimit,
    min: 0,
    acquire: 100 * 1000,
    idle: 10000
  },
  timezone: '+08:00'
});

try {
  sequelizeObj.authenticate().then(() => {
    console.log('Database connection has been established successfully.');
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
module.exports.sequelizeObj = sequelizeObj;

const dbConf2 = {
  database: process.env.DB_DATABASE2,
  user: process.env.DB_USER2,
  password: process.env.DB_PASSWORD2,
  host: process.env.DB_HOST2,
//   port: Number(process.env.DB_PORT),
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT)
}

let sequelizeObj2 = new Sequelize(dbConf2.database, dbConf2.user, dbConf2.password, {
    host: dbConf2.host,
    dialect: 'mssql',
    logging: msg => {
        console.log(msg)
        log.info(msg)
    },
    define: {
        freezeTableName: true
    },
    pool: {
        max: dbConf2.connectionLimit,
        min: 0,
        acquire: 100*1000,
        idle: 10000
    },
	timezone: '+08:00'
});
module.exports.sequelizeObj2 = sequelizeObj2;