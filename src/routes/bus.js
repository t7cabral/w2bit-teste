
'use strict';

const router = require('express').Router();
const BusController = require('../controllers/BusController');

router.get('/all',
  BusController.listAll);

router.get('/:id',
  BusController.listOne);

router.post('/',
  BusController.create);

router.put('/:id',
  BusController.updateOne);

router.delete('/:id',
  BusController.deleteOne);

module.exports = router;
