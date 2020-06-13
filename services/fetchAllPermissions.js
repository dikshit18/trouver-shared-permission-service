require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const moment = require('moment');
const fetchAllPermissions = async (req, res) => {
  try {
    const params = {
      TableName: process.env.PERMISSION_SETS_LOOKUP_TABLE
    };
    const permissionSets = await dynamoDb.scan(params);
    if (permissionSets.Items.length) {
      const response = successCodes['permissionSetFetchSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        permissionSets: permissionSets.Items
      });
    } else {
      return res.status(200).send({
        statusCode: 200,
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

const checkIfUserExists = async email => {
  const params = {
    TableName: process.env.ADMIN_TABLE,
    Key: {
      email
    }
  };
  const doesUserExists = await dynamoDb.get(params);
  if (doesUserExists.Item) {
    return true;
  } else return false;
};
const addAdminDetails = async (firstName, lastName, email, sub) => {
  const params = {
    TableName: process.env.ADMIN_TABLE,
    Item: {
      created: moment.utc().format(),
      firstName,
      lastName,
      email,
      sub
    }
  };
  await dynamoDb.create(params);
};
module.exports = {fetchAllPermissions};
