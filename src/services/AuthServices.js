'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  generateUserToken
};

function generateUserToken (user) {
  return jwt.sign(user, process.env.APP_JWT_SECRET);
}