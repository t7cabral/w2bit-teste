'use strict';

const HttpStatus = require('http-status-codes');
const router = require('express').Router();
const upload = require('multer')({ dest: process.env.APP_STORAGE });
const UserController = require('../controllers/UserController');
const validation_data_create_user = require('../middlewares/validation_data_create_user');

router.post('/avatar',
  upload.single('image'),
  UserController.upload);

router.post('/',
  validation_data_create_user,
  UserController.create);

router.get('/all',
  UserController.listAll);

module.exports = router;
