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

    if(!bus) throw new TicketException("ERR_BUS_NOT_FOUND", "Bus not found!");
    if(!passenger) throw new TicketException("ERR_PASSENGER_NOT_FOUND", "Passenger not found!");

    await validateSeatAvailability (actingUser, bus, ticketData.seat);

    res.locals.bus = bus;
    res.locals.passenger = passenger;
    return next();
  } catch (err) {
    if(err instanceof TicketException) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    return res.status(HttpStatus.BAD_REQUEST).json({
      errorCode: 'ERR_TICKET_500_CREATE',
      message: "The request failed!"
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
      ? resolve()
      : reject( new TicketException("ERR_TICKET_INVALID_SEAT", `Invalid fields: ${invalidFields.join(', ')}`));
  });
}

// validate seat availability
async function validateSeatAvailability (actingUser, bus, seat) {
  try {
    if(seat < 1 || seat > bus.seats) throw new TicketException("ERR_TICKET_INVALID_SEAT", "The seat number is invalid!");

    const availableSeat = await db.where({
      userId: actingUser.id,
      busId: bus.id,
      seat
    })
    .select('*')
    .from('ticket')
    .whereNull('deleted_at')
    .first();

    if(availableSeat) throw new TicketException("ERR_TICKET_SEAT_NOT_AVAILABLE", "Seat not available!");
    return;
  } catch (err) {
    throw err;
  }
}

function TicketException(errorCode, message) {
  this.errorCode = errorCode;
  this.message = message
}
