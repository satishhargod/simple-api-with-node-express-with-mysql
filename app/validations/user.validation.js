const { password } = require('./custom.validation');
const validateRequest = require('../middlewares/validate');
// const Joi = require('joi');
const Joi = require('@hapi/joi');

const userList = (req, res, next) => {
  const schema = Joi.object({
      only_admin: Joi.boolean().required().allow(null),
      page: Joi.number(),
      row_limit:Joi.number(),
    });
  validateRequest(req, res, next, schema);
}

const userUpdate = (req, res, next) => {
    const schema = Joi.object({
        id:Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        profile_photo:Joi.string(),
    });

    validateRequest(req, res, next, schema);
}

module.exports = {
    userList,
    userUpdate
};
