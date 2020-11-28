'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');
const { pick } = require('lodash');

module.exports = {
  listOne,
  listAll,
  create,
  updateOne,
  deleteOne
}

async function listOne (req, res) {
  const actingUser = res.locals.actingUser;
  const busId = req.params.id;

  try {
    const bus = await db.where({id: busId, userId: actingUser.id})
      .select('id', 'plate', 'year', 'model', 'seats', 'created_at')
      .from('bus')
      .whereNull('deleted_at')
      .first();
    return res.status(HttpStatus.OK).json(bus || {});
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_BUS_LIST_ONE',
      message: err.message
    });
  }
}

async function listAll (req, res) {
  const actingUser = res.locals.actingUser;
  try {
    const bus = await db.where({userId: actingUser.id})
      .select('id', 'plate', 'year', 'model', 'seats', 'created_at')
      .whereNull('deleted_at')
      .from('bus');
    return res.status(HttpStatus.OK).json({
      total: bus.length,
      bus
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_BUS_LIST_ALL',
      message: err.message
    });
  }
}

async function create (req, res) {
  const actingUser = res.locals.actingUser;
  let dataBus = pick(req.body, ['plate', 'year', 'model', 'seats']);
  dataBus.userId = actingUser.id;

  try {
    const bus = await db.insert(dataBus).into('bus').returning('*');
    return res.status(HttpStatus.CREATED).json(bus);
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_BUS_CREATE',
      message: err.message
    });
  }
}

async function updateOne (req, res) {
  const busId = req.params.id;
  const dataBus = pick(req.body, ['plate', 'year', 'model', 'seats']);

  try {
    const bus = await db('bus')
    .where({id: busId})
    .first()
      .whereNull('deleted_at')
      .update(dataBus, ['plate', 'year', 'model', 'seats'])
      
      // .select('id', 'plate', 'year', 'model', 'seats', 'created_at');
    return res.status(HttpStatus.OK).json(bus[0]);
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_BUS_DELETE_ONE',
      message: err.message
    });
  }


  console.log('bus_id: ', bus_id, '\nbus_data:', x);


  return res.status(HttpStatus.OK).json('Rota updated bus');





}

async function deleteOne (req, res) {
  const busId = req.params.id;
  try {
    await db('bus')
      .where({id: busId})
      .whereNull('deleted_at')
      .update({
        deleted_at: db.fn.now(6)
      });
    return res.status(HttpStatus.OK).json();
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_BUS_DELETE_ONE',
      message: err.message
    });
  }
}
