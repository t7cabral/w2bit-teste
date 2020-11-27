'use strict';

const HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
  const { login=null, password=null } = req.body;

  if(login || password) return next();

  return res.status(HttpStatus.BAD_REQUEST).json({
    errorCode: 'AUTH_LOGIN_VALIDATION_FIELD',
    message: 'Login and password are required.'
  });
}
