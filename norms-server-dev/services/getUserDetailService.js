const log = require('../winston/logger.js').logger('getUserDetailService');
const Response = require('../util/response.js');
const { sequelizeObj,sequelizeObj2 } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const SHA256 = require("crypto-js/sha256");


module.exports.SendTokenInfo = async function (req, res) {
    console.log(req.body)
    if (!req.body.token) {
        return Response.error(res, "Please send the token to the body!")
    }

    //decode

    let decodeToken = req.body.token;
    // let salting = SHA256("aaa").toString();//SHA256 salting
    // let timestamp = new Date().getTime();

    let userId = decodeToken.substring(77);
    console.log(userId)

    //select user by database2,into session

    let rows = {userId};

    let [userObj] = await sequelizeObj2.query(
        `SELECT * FROM sys_user where id =${userId}`,
        {
            type: QueryTypes.SELECT,
        }
    )
    // res.redirect("http://localhost:5174")
    return Response.success(res, 'http://localhost:5174')
}