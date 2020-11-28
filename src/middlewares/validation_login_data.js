'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');


module.exports = async (req, res, next) => {
  const { login=null, password=null } = req.body;

  const users = await db.select().from('user');
  console.log(users);

  if(login || password) return next();

  return res.status(HttpStatus.BAD_REQUEST).json({
    errorCode: 'AUTH_LOGIN_VALIDATION_FIELD',
    message: 'Login and password are required.'
  });
}
