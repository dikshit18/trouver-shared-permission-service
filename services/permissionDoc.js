require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const getPermissionDocument = async (req, res) => {
  try {
    await validateSchema(req.body, schema.fetchPermissionDoc);
    const {identityId: sub} = req.body;
    const params = {
      TableName: process.env.PERMISSION_SETS_ASSOCIATION_TABLE,
      KeyConditionExpression: '#subIdentity = :sub',
      ExpressionAttributeNames: {
        '#subIdentity': 'sub'
      },
      ExpressionAttributeValues: {
        ':sub': sub
      }
    };
    const permissionSets = await dynamoDb.query(params);
    //Checking valid sets
    if (permissionSets.Items.length) {
      const response = successCodes['permissionSetFetchSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        identityId: sub,
        permissionSets: permissionSets.Items
      });
    } else {
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        identityId: sub,
        permissionSets: []
      });
    }
  } catch (e) {
    //Needed to be defined again
    if (e.code === 'schemaError') {
      const response = errorCodes['joi'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      //default error
      const response = errorCodes['default'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
  }
};

module.exports = {getPermissionDocument};
