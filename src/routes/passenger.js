
'use strict';

const router = require('express').Router();
const PassengerController = require('../controllers/PassengerController');

router.get('/all',
  PassengerController.listAll);

router.get('/:id',
  PassengerController.listOne);

router.post('/',
  PassengerController.create);

router.put('/:id',
  PassengerController.updateOne);

module.exports = router;
