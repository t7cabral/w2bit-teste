'use strict';

const HttpStatus = require('http-status-codes');
const db = require('../database');
const { pick } = require('lodash');

module.exports = {
  create,
  updateOne,
  listOne,
  listAll
}

async function create (req, res) {
  const actingUser = res.locals.actingUser;
  let passengerData = pick(req.body, ['cpf', 'name', 'age']);
  passengerData.userId = actingUser.id;

  try {
    const passenger = await db.insert(passengerData)
      .into('passenger')
      .returning(['id', 'cpf', 'name', 'age', 'created_at', 'updated_at', 'deleted_at']);
    return res.status(HttpStatus.CREATED).json(passenger);
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_PASSENGER_CREATE',
      message: err.message
    });
  }
}

async function updateOne (req, res) {
  const actingUser = res.locals.actingUser;
  const passengerId = req.params.id;
  const passengerData = pick(req.body, ['id', 'cpf', 'name', 'age', 'created_at', 'updated_at', 'deleted_at']);

  try {
    const passenger = await db('passenger')
      .where({userId: actingUser.id, id: passengerId})
      .first()
      .whereNull('deleted_at')
      .update({updated_at: db.fn.now(6), ...passengerData}, ['id', 'cpf', 'name', 'age', 'created_at', 'updated_at', 'deleted_at']);

    return res.status(HttpStatus.OK).json(passenger[0]);
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_BUS_DELETE_ONE',
      message: err.message
    });
  }
}

async function listOne (req, res) {
  const actingUser = res.locals.actingUser;
  const passengerId = req.params.id;

  try {
    const passenger = await db.where({id: passengerId, userId: actingUser.id})
      .select('id', 'cpf', 'name', 'age', 'created_at', 'updated_at')
      .from('passenger')
      .whereNull('deleted_at')
      .first();
    return res.status(HttpStatus.OK).json(passenger || {});
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_PASSENGER_LIST_ONE',
      message: err.message
    });
  }
}

async function listAll (req, res) {
  const actingUser = res.locals.actingUser;

  try {
    const passengers = await db.where({userId: actingUser.id})
      .select('id', 'cpf', 'name', 'age', 'created_at', 'updated_at')
      .whereNull('deleted_at')
      .from('passenger');
    return res.status(HttpStatus.OK).json({
      total: passengers.length,
      passengers
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR_500_PASSENGER_LIST_ALL',
      message: err.message
    });
  }
}