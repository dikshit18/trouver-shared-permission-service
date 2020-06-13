const Joi = require('@hapi/joi');
const JoiGuidV4 = Joi.string().guid({version: ['uuidv4']});

const schema = (() => {
  return {
    associatePermission: Joi.object()
      .keys({
        identityId: JoiGuidV4.required(),
        permissionSets: Joi.array().required()
      })
      .unknown(false),

    disAssociatePermission: Joi.object()
      .keys({
        identityId: JoiGuidV4.required(),
        permissionSets: Joi.array().required()
      })
      .unknown(false),
    fetchPermissionDoc: Joi.object()
      .keys({
        identityId: JoiGuidV4.required()
      })
      .unknown(false)
  };
})();

module.exports = {schema};
