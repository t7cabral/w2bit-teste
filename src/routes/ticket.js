
'use strict';

const router = require('express').Router();
const TicketController = require('../controllers/TicketController');
const validation_data_ticket = require('../middlewares/validation_data_ticket');

router.post('/',
  validation_data_ticket,
  TicketController.create);

module.exports = router;
