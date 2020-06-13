require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const moment = require('moment');
const disAssociatePermissionSet = async (req, res) => {
  try {
    await validateSchema(req.body, schema.associatePermission);
    const {identityId: sub, permissionSets} = req.body;
    for (const set of permissionSets) {
      const params = {
        TableName: process.env.PERMISSION_SETS_ASSOCIATION_TABLE,
        Key: {
          sub,
          permissionSetId: set.id
        }
      };
      await dynamoDb.delete(params);
    }
    const response = successCodes['permissionSetDisassociationSuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code
    });
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

module.exports = {disAssociatePermissionSet};
