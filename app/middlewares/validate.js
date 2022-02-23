// const Joi = require('@hapi/joi');
// const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');

// const validate = (schema) => (req, res, next) => {
//   const validSchema = pick(schema, ['params', 'query', 'body']);
//   const object = pick(req, Object.keys(validSchema));
//   const { value, error } = Joi.compile(validSchema)
//     .prefs({ errors: { label: 'key' } })
//     .validate(object);

//   if (error) {
//     const errorMessage = error.details.map((details) => details.message).join(', ');
//     console.log("errorMessage", errorMessage)
//     return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
//   }
//   Object.assign(req, value);
//   return next();
// };

// module.exports = validate;


const Joi = require('@hapi/joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const ResponseObject = require('../utils/ResponseObject');

const validateRequest = (req, res, next, schema) => {
  const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
   //console.log("details", error.details)
      let errormessage = error.details.map(errordetails => {
        return{
          key: errordetails.context.key,
          message : errordetails.message
        }
      })
      res.status(200).send(new ResponseObject(httpStatus.BAD_REQUEST, errormessage));
  } else {
      req.body = value;
      next();
  }
};

module.exports = validateRequest;
