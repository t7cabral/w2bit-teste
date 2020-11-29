'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');
const { pick } = require('lodash');

module.exports = {
  create,
  deleteOne,
  listAll
}

async function create (req, res) {
  const actingUser = res.locals.actingUser;
  const ticketData = pick(req.body, ['busId', 'passengerId', 'seat']);
  const { bus, passenger } = res.locals;

  try {
    const ticket = await db.insert({userId: actingUser.id, ...ticketData})
      .into('ticket')
      .returning(['id', 'seat', 'created_at']);
    
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

async function deleteOne (req, res) {
  const actingUser = res.locals.actingUser;
  const ticketId = req.params.id;

  try {
    await db('ticket')
      .where({userId: actingUser.id, id: ticketId})
      .whereNull('deleted_at')
      .update({
        deleted_at: db.fn.now(6)
      });
    return res.status(HttpStatus.OK).json();
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_TICKET_DELETE_ONE',
      message: err.message
    });
  }
}

async function listAll (req, res) {
  const actingUser = res.locals.actingUser;

  try {

    const tickets = await db.where({userId: actingUser.id})
      .select('*')
      .whereNull('deleted_at')
      .from('ticket');

    const listBus = await db.where({userId: actingUser.id})
      .whereIn('id', tickets.map(ticket => ticket.busId))
      .select('id', 'plate', 'year', 'model', 'seats', 'created_at')
      .from('bus');

    const listPassenger = await db.where({userId: actingUser.id})
      .whereIn('id', tickets.map(ticket => ticket.passengerId))
      .select('id', 'cpf', 'name', 'age', 'created_at', 'updated_at')
      .from('passenger');

    const ticketsJoin = [];

    tickets.forEach(async (item, index, array) => {
      ticketsJoin.push({
        id: item.id,
        seat: item.seat,
        created_at: item.created_at,
        passenger: listPassenger.find(passenger => passenger.id === item.passengerId),
        bus: listBus.find(bus => bus.id === item.busId)
      });
    });

   return res.status(HttpStatus.OK).json({
     total: ticketsJoin.length || 0,
     tickets: ticketsJoin
   });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_LIST_ALL',
      message: err.message
    });
  }
}
