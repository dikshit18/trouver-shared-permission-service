const Joi = require('@hapi/joi');
const JoiGuidV4 = Joi.string().guid({version: ['uuidv4']});

const schema = (() => {
  return {
    associatePermission: Joi.object()
      .keys({
        identityId: Joi.string()
          .email()
          .required(),
        permissionSet: Joi.array().required()
      })
      .unknown(false),

    disAssociatePermission: Joi.object()
      .keys({
        identityId: Joi.string()
          .email()
          .required(),
        permissionSet: Joi.array().required()
      })
      .unknown(false)
  };
})();

module.exports = {schema};
