const express = require('express');
const { keysToCamel } = require('../common/utils');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const { connectToDb } = require('../server/mongodb');
const mongodb_collection = process.env.MONGODB_COLLECTION;


const hospitalRouter = express.Router();

hospitalRouter.get('/', async(req, res) => {
    try {
        const database = await connectToDb();
        const patients = database.collection("kaiserPermanente");
        const allPatients = await patients.find().toArray();
        res.status(200).json(keysToCamel(allPatients));
    } catch(err) {
        console.log(err.message);
    }
});

// GET request for all patients in the hospital
hospitalRouter.get('/:hospital', async(req, res) => {
    try {
        const hospitalName = req.params.hospital.toString();
        const database = await connectToDb();
        const patients = database.collection(`${hospitalName}`);
        const allPatients = await patients.findOne({"name": hospitalName});
        res.status(200).json(keysToCamel(allPatients));
    } catch (err) {
        console.log(err.message);
    }
});

// GET request for single patient's information
hospitalRouter.get('/:hospital/:patient', async(req, res) => {
    try {
        const hospitalName = req.params.hospital.toString();
        const patientMrn = parseInt(req.params.patient);
        const database = await connectToDb();
        const patients = database.collection(`${hospitalName}`);
        const hospital = await patients.findOne({"name": hospitalName});
        if (hospital.patients.includes(patientMrn)) {
            const allPatients = database.collection(process.env.MONGODB_COLLECTION);
            const patient = await allPatients.findOne({"mrn": patientMrn} );
            res.status(200).json(keysToCamel(patient));
        } else {
            const allPatients = database.collection(process.env.MONGODB_COLLECTION);
            const patient = await allPatients.findOne({"mrn": -1} );
            res.status(200).json(keysToCamel(patient));
        }
    } catch(err) {
        console.log(err.message);
    }
});

module.exports = hospitalRouter;