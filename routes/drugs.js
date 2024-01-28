const express = require('express');
const { keysToCamel } = require('../common/utils');
const pgp = require('pg-promise')({});
require('dotenv').config();

const db = pgp({
    host: process.env.DRUGS_HOST,
    user: process.env.AWS_USER,
    password: process.env.AWS_PASSWORD,
    port: process.env.AWS_PORT,
    database: process.env.AWS_DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
});

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
        const similar = await db.query(`SELECT * FROM drugs WHERE LOWER(drug_name) LIKE LOWER(CONCAT('${drugName}', '%'))`);
        let drugData = [];
        similar.forEach(element => {
            drugData.push(element.drug_name);
        });
        res.status(200).json(drugData);
    } catch(err) {
        res.status(500).send(err.message);
    }
});

module.exports = drugsRouter;