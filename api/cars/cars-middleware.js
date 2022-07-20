const Car = require('./cars-model');
const vin = require('vin-validator')
const db = require('../../data/db-config');

const checkCarId = (req, res, next) => {
  const {id} = req.params;
  Car(id)
  .then((car) => {
    if (!car) {
      res.status(400).json({message: "No car with that ID exists"})
    } else {
      next();
    }
  })
}

const checkCarPayload = (req, res, next) => {
 if(!req.body.vin) {
  res.status(400).json({message: "vin is missing"})
 }
 if(!req.body.make) {
  res.status(400).json({message: "make is missing"})
 }
 if(!req.body.model) {
  res.status(400).json({message: "model is missing"})
 }
 if(!req.body.mileage) {
  res.status(400).json({message: "mileage is missing"})
 }
next()
}

const checkVinNumberValid = (req, res, next) => {
  if (vin.validate(req.body.vin)) {
    next()
  } else {
    res.status(400).json({message: `vin ${req.body.vin} is invalid`})
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  try {
    const existing = await db('cars').where('vin', req.body.vin.trim()).first()
    if(!existing) {
      next()
    } else {
      res.status(400).json({message: `vin ${req.body.vin} already exists`})
    }
  } catch(err) {
    next(err)
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
}