class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
   

    if (stack) {
      this.stack = stack;
    } else {
      console.log("this.statusCode", this.statusCode, this.isOperational, stack)
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
