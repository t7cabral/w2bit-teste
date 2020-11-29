'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');
const { pick } = require('lodash');

module.exports = async (req, res, next) => {
  const actingUser = res.locals.actingUser;
  const ticketData = pick(req.body, ['busId', 'passengerId', 'seat']);

  try {
    const [isFieldsValid, bus, passenger] = await Promise.all([
      // Validates received parameters
      checkFieldValidation(ticketData.busId, ticketData.passengerId, ticketData.seat),
      
      // Load data from Bus
      db.where({id: ticketData.busId, userId: actingUser.id})
        .select('id', 'plate', 'year', 'model', 'seats', 'created_at')
        .from('bus')
        .whereNull('deleted_at')
        .first(),

      // Load data from Passenger
      db.where({id: ticketData.passengerId, userId: actingUser.id})
      .select('id', 'cpf', 'name', 'age', 'created_at', 'updated_at')
      .from('passenger')
      .whereNull('deleted_at')
      .first(),

    ]);

    res.locals.bus = bus;
    res.locals.passenger = passenger;
    return next();
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: 'ERR_TICKET_CREATE_VALIDATION',
      message: err.message
    });
  }
}

// Validates received parameters
function checkFieldValidation (busId, passengerId, seat) {
  return new Promise((resolve, reject) => {
    const invalidFields = [];

    if(!busId) invalidFields.push('busId');
    if(!passengerId) invalidFields.push('passengerId');
    if(!seat || !Number.isInteger(seat) || seat === 0) invalidFields.push('seat');

    return invalidFields.length === 0
      ? resolve(true)
      : reject(Error(`Invalid fields: ${invalidFields.join(', ')}`));
  });
}


