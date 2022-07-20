const express = require('express');
const {checkCarPayload, checkVinNumberUnique, checkVinNumberValid} = require('./cars-middleware')
const Car = require('./cars-model');

const router = express.Router();


router.get('/', (req, res) => {
    Car.getAll()
        .then(cars => {
            res.json(cars)
        })
        .catch(err => {
            res.status(400).json({message: `Failed to retrieve cars: ${err.message}`})
        })
})

router.get('/:id', (req, res) => {
    Car.getById(req.params.id)
    .then(cars => {
        if(cars) {
            res.status(200).json(cars)
        } else {
            res.status(404).json({message: "That Id does not match our records"})
        }
     })
    .catch(() => {
       res.status(500).json({message: "Failed to retrieve car"})
    })
})

router.post('/', checkCarPayload, checkVinNumberUnique, checkVinNumberValid, async (req, res, next) => {
    try {
        const car = await Car.create(req.body)
        res.json(car)
    }catch(err){
        next(err)
    }
})

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({message: err.message})
})

module.exports = router;