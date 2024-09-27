const { Storage } = require("../model/storage")
const Response = require('../util/response.js');

module.exports.InitStorageStatus = async function (req, res) {
  const parsedDataEntries = [];

  let rows = await Storage.findByPk(1);

  if (!rows) {
    return Response.error(res, 'Storage record not found.');
  }

  for (const [key, value] of Object.entries(rows.dataValues)) {
    if (rows.dataValues.id == 1) {
      if (key === 'id') {
        continue
      }

      try {
        const parsedValue = JSON.parse(value);
        parsedDataEntries.push({ key, value: parsedValue });
      } catch (error) {
        parsedDataEntries.push({ key, value: null });
      }
    }
  }

  return Response.success(res, parsedDataEntries);
}