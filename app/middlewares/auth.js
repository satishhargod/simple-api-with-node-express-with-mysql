const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Session TimedOut! Please login back'));
  }

  req.user = user;

  if (req.user.status == false || req.user.deletedAt != null) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Session TimedOut! Please login back'));
  }

  if (requiredRights.length) {
    const userRights = roleRights.get(user.user_type);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user._id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'You don\'t have permission to access this api'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
