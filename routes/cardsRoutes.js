const express = require('express');
const Card = require('../models/cardsModel');
const router = express.Router();
    
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

      router.get('/:id', async function(req, res, next) {
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
    
    module.exports = router;