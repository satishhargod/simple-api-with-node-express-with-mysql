const { password } = require('./custom.validation');
const validateRequest = require('../middlewares/validate');
// const Joi = require('joi');
const Joi = require('@hapi/joi');

const signInAdmin = (req, res, next) => {
  const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      type: Joi.string().required()
    });
  validateRequest(req, res, next, schema);
}

const signup = (req, res, next) => {
  const schema = Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      role_id: Joi.number().required(),
      profile_photo:Joi.string(),
    });
  validateRequest(req, res, next, schema);
}



module.exports = {
  signInAdmin,
  signup
};
