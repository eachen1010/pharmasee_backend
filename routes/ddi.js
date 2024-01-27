const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const ddiRouter = express.Router();

// GET - Returns all data from the ddi table
ddiRouter.get('/', async(req, res) => {
    try {
        const allDDIs = await db.query(`SELECT * FROM ddi;`);
        res.status(200).json(keysToCamel(allDDIs));
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// GET /:drug_one/:drug_two
ddiRouter.get('/:drugOne/:drugTwo', async(req, res) => {
    try {
        const drugOne = req.params.drugOne;
        const drugTwo = req.params.drugTwo;
        const ddi = await db.query(`SELECT * FROM ddi WHERE UPPER(drug_one) = UPPER($1) AND UPPER(drug_two) = UPPER($2)`, [drugOne, drugTwo]);
        res.status(200).json(keysToCamel(ddi));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = ddiRouter;