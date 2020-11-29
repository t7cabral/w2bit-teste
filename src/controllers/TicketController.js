'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');
const { pick } = require('lodash');

module.exports = {
  create
}

async function create (req, res) {
  const actingUser = res.locals.actingUser;
  const ticketData = pick(req.body, ['busId', 'passengerId', 'seat']);
  const { bus, passenger } = res.locals;

  try {
    const ticket = await db.insert({userId: actingUser.id, ...ticketData})
      .into('ticket')
      .returning(['id', 'seat']);
    
    if(ticket.length === 0) return res.status(HttpStatus.BAD_REQUEST).json('expectxxx');
    return res.status(HttpStatus.CREATED).json({
      ...ticket[0],
      passenger,
      bus
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_PASSENGER_CREATE',
      message: err.message
    });
  }
}
