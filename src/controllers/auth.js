'use strict';
const HttpStatus = require('http-status-codes');

module.exports = {
  login
}

function login (req, res) {

  console.log('Hello World B2WBit');
  res.status(HttpStatus.ACCEPTED).json({ message: ['Hello World B2WBit'] });
  
}