const log = require('../winston/logger.js').logger('apiKeyListService');
const Response = require('../util/response.js');
const { sequelizeObj } = require('../db/dbConf.js');
const { Op, QueryTypes } = require('sequelize');
const { ApiKeyList } = require("../model/apiKeyListModel")
const Utils = require('../util/utils');

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


module.exports.getApiKeyList = async function (req, res) {
    let rows = await sequelizeObj.query(
        `SELECT id, otGateway, updateDate, oplDate FROM api_key_list;`,
        {
            type: QueryTypes.SELECT,
        }
    )
    return Response.success(res, rows)
}

module.exports.updateApiKey = async function (req, res) {
    console.log(req.body.id)
    let {id} = req.body;
    //
    let [otObj] = await sequelizeObj.query(
        `SELECT * FROM api_key_list where id =${id}`,
        {
            type: QueryTypes.SELECT,
        }
    )

    if(!otObj.uri){
        return Response.error(res, "url not found")
    }

    let timestamp = new Date().getTime();

    // get apiKey  timestamp+name+uuidv4
    let apiKey = timestamp+otObj.otGateway +uuidv4().substring(0,6);
    let encreptKey = otObj.otGateway+uuidv4().substring(0,6);
    
    
    // console.log('apiKey',apiKey)
    // console.log('encreptKey',encreptKey)
    //token
    
    let token = Utils.generateTokenKey({ timestamp, name: otObj.otGateway });
    // console.log("token",token)

    let aesApiKey = Utils.AESEncrypt(apiKey,encreptKey);
    console.log("aesApiKey",aesApiKey)
    
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    await ApiKeyList.update({
        apiKey,token,aesApiKey,encreptKey,status:0,oplDate:endOfDay.getTime(), updateDate:new Date().getTime()
    }, {where: { id }})
    
    // console.log("AESDecrypt",Utils.AESDecrypt(aesApiKey,encreptKey))
    // send token+encreptKey to interface
    await axios.post(otObj.uri,{token,encreptKey:encreptKey})
    
    return Response.success(res, null)
}
// pseudo-code
module.exports.sendToken = async function (req, res) {
    console.log('req.body.token',req.body.token)
    console.log('req.body.encreptKey',req.body.encreptKey)
    return Response.success(res, req.body.token)
} 

module.exports.receiveToken = async function (req, res) {
    let {token,encreptKey} = req.body;
    console.log('req.body.token',token)
    console.log('req.body.encreptKey',encreptKey)

    let isValidityToken = true;
    let decodedToken = await Utils.decodedTokenKey(token).catch((err)=>{
        console.log("err",err)
        isValidityToken = false;
    });
    // console.log("decodedToken",decodedToken)
    let [otObj] = await sequelizeObj.query(
        `SELECT * FROM api_key_list where token ='${token}'`,
        {
            type: QueryTypes.SELECT,
        }
    )
    if(!otObj){
        isValidityToken = false;
    }
    // console.log("otObj",otObj)
    if(!decodedToken||!decodedToken.data||!otObj||decodedToken.data.name!==otObj.otGateway){
        isValidityToken = false;
    }
    if(!isValidityToken){
        return Response.error(res, "Illegal token")
    }

    return Response.success(res, otObj.aesApiKey)
} 

module.exports.updateStatus = async function (req, res) {
    let {apiKey} = req.body;
    let [otObj] = await sequelizeObj.query(
        `SELECT * FROM api_key_list where apiKey ='${apiKey}'`,
        {
            type: QueryTypes.SELECT,
        }
    )
    if(!otObj){
        return Response.error(res, "apiKey error")
    }
    await ApiKeyList.update({
        status:1
    }, {where: { id:otObj.id }})
    return Response.success(res, null)
}