'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');
const { pick } = require('lodash');
const AuthServices = require('../services/AuthServices');

module.exports = {
  login
}

async function login (req, res) {
  const {login, password} = pick(req.body, ['login', 'password']);

  try {
    const user = await db('user').where({login, password}).select('id', 'name', 'photoUrl', 'login', 'password').first();
    
    if(!user) throw new AuthException("ERR_LOGIN_INVALID_CREDENTIALS", "Login and/or password invalid.");
    
    const token = await AuthServices.generateUserToken(user);

    delete user.password;
    delete user.login;

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({token, user});
  } catch (err) {
    if(err instanceof AuthException) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_USER_LOGIN',
      message: err.message
    });
  }
}

function AuthException(errorCode, message) {
  this.errorCode = errorCode;
  this.message = message
}