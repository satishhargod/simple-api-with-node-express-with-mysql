const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Message = require('../utils/ResponseMessage');
const config = require('../config/config');

const secretkey = (requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    if (req.headers.secretkey != config.secret_key) {
      return reject(new ApiError(httpStatus.METHOD_NOT_ALLOWED, Message.secretPermissionError));
    }
    //next();
    resolve();
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = secretkey;
