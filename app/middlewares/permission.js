const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Message = require('../utils/ResponseMessage');

const permission = (requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    const user = req.user;
    if (user.user_permissions[requiredRights] == false) {
      return reject(new ApiError(httpStatus.METHOD_NOT_ALLOWED, Message.permissionError));
    }
    //next();
    resolve();
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = permission;
