const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { JWTHeader, SecretKey } = require('../conf/jwt');

const formatCurrency = function (amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
module.exports.formatCurrency = formatCurrency


const formatNumber = function (amount) {
    let numberFormat = formatCurrency(amount);
    return numberFormat.slice(1)
}
module.exports.formatNumber = formatNumber

const generateTokenKey = function (data) {
    // const header = Buffer.from(JSON.stringify(jwtConf.Header)).toString('base64');
    // const payload = Buffer.from(JSON.stringify({userId, username})).toString('base64');
    // const encodedString = header + '.' + payload;
    // const signature = crypto.createHmac(jwtConf.Header.algorithm, jwtConf.Secret).update(encodedString).digest('base64');
    // return header + '.' + payload + '.' + signature;

    // https://www.npmjs.com/package/jsonwebtoken
    return jwt.sign(
        { data: data },
        SecretKey,
        { algorithm: JWTHeader.algorithm.toUpperCase(), expiresIn: JWTHeader.expire }
    );
};
module.exports.generateTokenKey = generateTokenKey;

const decodedTokenKey = async function (token) {
    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, SecretKey, { algorithms: JWTHeader.algorithm.toUpperCase() }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
    return decoded;
}
module.exports.decodedTokenKey = decodedTokenKey;

const aes_key = "0123456789abcdef" // must be 16 char

const AESEncrypt = function (data,aesKey) {
    let key = CryptoJS.enc.Utf8.parse(CryptoJS.enc.Base64.parse(aesKey));
    let encryptedData = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    let hexData = encryptedData.ciphertext.toString();
    // console.log(hexData)
    return hexData
}
module.exports.AESEncrypt = AESEncrypt

const AESDecrypt = function (hexData,aesKey) {
    let key = CryptoJS.enc.Utf8.parse(CryptoJS.enc.Base64.parse(aesKey));
    let encryptedHexStr = CryptoJS.enc.Hex.parse(hexData);
    let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    let text = decryptedData.toString(CryptoJS.enc.Utf8);
    // console.log('text',text)
    return text
}
module.exports.AESDecrypt = AESDecrypt

const randomNum = function(digits){
    return Math.floor(Math.random() * Math.pow(10, digits));
}
module.exports.randomNum = randomNum