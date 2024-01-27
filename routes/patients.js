const express = require('express');
const { keysToCamel } = require('../common/utils');
require("dotenv").config();
const connectToDb = require('../server/mongodb');
const mongodb_collection = process.env.MONGODB_COLLECTION;

const patientRouter = express.Router();

// GET request for all patients
patientRouter.get('/', async(req, res) => {
    try {
        const database = await connectToDb();
        const patients = database.collection(mongodb_collection);
        const allPatients = await patients.find({"mrn": { $exists : true } }).toArray();
        res.status(200).json(keysToCamel(allPatients));
    } catch(err) {
        console.log(err.message);
    }
});

// GET request for one patient by mrn
patientRouter.get('/:patient_mrn', async(req, res) => {
    try {
        const { patientMrn } = req.params;
        const database = await connectToDb();
        const patients = database.collection(mongodb_collection);
        const patient = await patients.findOne({"mrn": patientMrn});
        res.status(200).json(keysToCamel(patient));
    } catch(err) {
        console.log(err.message);
    }
});

module.exports = patientRouter;