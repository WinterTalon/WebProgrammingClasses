const express = require('express');
const Card = require('../models/cardsModel');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Validations
const cardValidations = [ body('name').isLength({ min: 4, max: 60 })
              .withMessage('Name must have between 4 and 60 characters'),
              body('level').isInt({ min: 0 })
              .withMessage('Level must be a non negative integer number'),
              body('type').isInt({ min: 1 })
              .withMessage('Type must be a positive integer number')];
    
    //GetAll
    router.get('/', async function(req, res, next) {
        try { 
            console.log("Get all cards");
            let result = await Card.getAll();
            console.log(result);
            res.status(result.status).send(result.result);
        } catch(err) {
            console.log(err);
            res.status(500).send(err);
        }
      });

    //GetByID
    router.get('/:id(\\d+)', async function(req, res, next) { // the "(\\d+)" is to just accept integer numbers
        try { 
            console.log("Get card with id "+req.params.id);
            let result = await Card.getById(req.params.id);
            console.log(result);
            res.status(result.status).send(result.result);
        } catch(err) {
            console.log(err);
            res.status(500).send(err);
        }
      });

    //Create Card
    router.post("/", ...cardValidations,
        async function (req, res, next) {
            try {
                console.log("Save card with name " + req.body.name);
    
                const valid = validationResult(req);
                if (!valid.isEmpty()) {
                    return res.status(400).json(valid.array());
                }
                let result = await Card.save(req.body);
                res.status(result.status).send(result.result);
            } catch (err) {
                console.log(err);
                res.status(500).send(err);
            }
        });

    //Edit Card
    router.put("/", ...cardValidations ,
        async function (req, res, next) {
            try {
                console.log("Edit card with id " + req.body.id);
                const valid = validationResult(req);
                if (!valid.isEmpty()) {
                    return res.status(400).json(valid.array());
                }
                let result = await Card.edit(req.body);
                res.status(result.status).send(result.result);
            } catch (err) {
                console.log(err);
                res.status(500).send(err);
            }
        });

    //Delete Card
    router.delete('/:id(\\d+)', async function (req, res, next) {
        try {
            console.log("Delete card with id " + req.params.id);
            let result = await Card.deleteById(req.params.id);
            res.status(result.status).send(result.result);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    });

    //Filters
    router.get('/filter', async function (req, res, next) {
        try {
            console.log("Filter cards");                        
            if (req.query.typeId) {
                let result = await Card.filterByType(req.query.typeId);
                res.status(result.status).send(result.result);
            } else if (req.query.descContains) {
                let result = await Card.filterByLoreOrDescription(req.query.descContains);
                res.status(result.status).send(result.result);
            } else {        
                res.status(400).send({ msg: "No filter provided" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    });
    module.exports = router;