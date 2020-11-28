'use strict';
const HttpStatus = require('http-status-codes');
const db = require('../database');

module.exports = {
  create,
  upload,
  listAll
}

async function create (req, res) {
  const data = res.locals.user;

  try {
    const user = await db.insert(data).into('user').returning('*');
    return res.status(HttpStatus.OK).json(user);
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_USER_CREATE',
      message: err.message
    });
  }  
}

function upload (req, res) {
  const file = req.file;
  res.status(HttpStatus.OK).json({
    avatar: `${process.env.APP_URL}/${file.path}`
  });
}

async function listAll (req, res) {
  try {
    const users = await db.select('id', 'name', 'photoUrl').from('user');
    return res.status(HttpStatus.OK).json({
      total: users.length,
      users
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_USER_LIST_ALL',
      message: err.message
    });
  }
}