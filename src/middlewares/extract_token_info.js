'use strict';

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  let token;

  if ((req.headers.authorization && (req.headers.authorization.indexOf('Bearer') === 0))) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if(token) {
    const actingUser = await jwt.verify(token, process.env.APP_JWT_SECRET);
    res.locals.actingUser = actingUser;
  }

  return next();
}
