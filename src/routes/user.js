'use strict';

const HttpStatus = require('http-status-codes');
const router = require('express').Router();
const upload = require('multer')({ dest: process.env.APP_STORAGE });
const userController = require('../controllers/user');
const validation_data_create_user = require('../middlewares/validation_data_create_user');

router.post('/avatar',
  upload.single('image'),
  userController.upload
);

router.post('/',
  validation_data_create_user,
  userController.create
);

module.exports = router;
