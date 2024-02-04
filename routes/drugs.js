const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const drugsRouter = express.Router();

drugsRouter.get('/', async(req, res) => {
    try {
        const allDrugs = await db.query(`SELECT * FROM drugs`);
        res.status(200).json(keysToCamel(allDrugs));
    } catch(err) {
        res.status(500).send(err.message);
    }
});

drugsRouter.get('/:drug', async(req, res) => {
    try {
        const drugName = req.params.drug;
        const similar = await db.query(`SELECT drug_name FROM drugs WHERE LOWER(drug_name) LIKE LOWER(CONCAT($1, '%'))`, [drugName]);
        res.status(200).json(keysToCamel(similar));
    } catch(err) {
        res.status(500).send(err.message);
    }
});

module.exports = drugsRouter;