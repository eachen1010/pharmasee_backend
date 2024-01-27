const express = require('express');
const { keysToCamel } = require('../common/utils');
const { builtinModules } = require('module');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const connectToDb = require('../server/mongodb');
const mongodb_db = process.env.MONGODB_NAME;
const mongodb_collection = process.env.MONGODB_COLLECTION;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const patientRouter = express.Router();

// GET request for all patients
patientRouter.get('/', async(req, res) => {
    try {
        // client.connect();
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
        const { patient_mrn } = req.params;
        // client.connect();
        const database = await connectToDb();
        const patients = database.collection(mongodb_collection);
        const patient = await patients.findOne({"mrn": patient_mrn});
        res.status(200).json(keysToCamel(patient));
    } catch(err) {
        console.log(err.message);
    }
});

module.exports = patientRouter;