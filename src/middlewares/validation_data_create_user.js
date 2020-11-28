'use strict';

const HttpStatus = require('http-status-codes');
const { pick } = require('lodash');

module.exports = async (req, res, next) => {
  const user = pick(req.body, [
    'name', 'photoUrl', 'addressUf', 'addressCity', 'login', 'password'
  ]);

  // validation required fields
  if(!user.name || !user.login || !user.password) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: 'ERR_USER_VALIDATION_FIELD',
      message: 'Missing required fields.'
    });
  }

  user.login = user.login.toLowerCase();
  res.locals.user = user;
  return next();
}
