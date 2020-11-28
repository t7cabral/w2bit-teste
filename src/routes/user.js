'use strict';

const HttpStatus = require('http-status-codes');
const router = require('express').Router();
const upload = require('multer')({ dest: process.env.APP_STORAGE });

router.post('/avatar',
  upload.single('image'),
  (req, res) => {
    const file = req.file;
    res.status(HttpStatus.OK).json({
        avatar: `${process.env.APP_URL}/${file.path}`
    });
  }
);

module.exports = router;
