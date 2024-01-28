const express = require('express');
const http = require('node:http');
const { keysToCamel } = require('../common/utils');
const { MongoClient, Db, Int32 } = require('mongodb');
require('dotenv').config();
const connectToDb = require('../server/mongodb');
const { hostname } = require('node:os');
const mongodb_collection = process.env.MONGODB_COLLECTION;


const familyRouter = express.Router();

familyRouter.get('/', async(req, res) => {
    try {
        const database = await connectToDb();
        const patients = database.collection("kaiserPermanente");
        const allPatients = await patients.find().toArray();
        res.status(200).json(keysToCamel(allPatients));
    } catch(err) {
        console.log(err.message);
    }
});

// GET request for all patients in the family
familyRouter.get('/:family', async(req, res) => {
    try {
        const familyName = req.params.family.toString();
        const database = await connectToDb();
        const patients = database.collection("kaiserPermanente");
        const allPatients = await patients.findOne({"name": familyName});
        let data = [];
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        
        await Promise.all(
            allPatients.patients.map((mrn) => 
                collection.findOne({"mrn": mrn}).then((result) => data.push(result))
            )
        );

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        console.log(err.message);
    }
});

// GET request for single patient's information
familyRouter.get('/:family/:patient', async(req, res) => {
    try {
        const familyName = req.params.family.toString();
        const patientMrn = parseInt(req.params.patient);
        const database = await connectToDb();
        const patients = database.collection("kaiserPermanente");
        const family = await patients.findOne({"name": familyName});
        if (family.patients.includes(patientMrn)) {
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

// POST request to add family member to the family
familyRouter.post('/:family/create', async(req, res) => {
    try {
        const familyName = req.params.family.toString();
        const { mrn, firstName, lastName, sex, dob, drugs } = req.body;
        const database = await connectToDb();
        const patients = database.collection(mongodb_collection);
        const family = database.collection("kaiserPermanente");
        const newPatient = await patients.insertOne({
            "mrn": mrn,
            "first_name": firstName,
            "last_name": lastName,
            "sex": sex,
            "dob": dob,
            "drugs": drugs
        });
        await family.findOneAndUpdate({"name": familyName}, {$push : {patients : patientMrn}})
        res.status(201).json(keysToCamel(newPatient));
    } catch(err) {
        console.log(err.message);
    }
});

// PUT request to add drug to member's file
familyRouter.put('/:family/update/:patientMrn/:drug/', async(req, res) => {
    try {
        const database = await connectToDb();
        const patientMrn = parseInt(req.params.patientMrn);
        const drug = req.params.drug.toString();
        const patients = database.collection(mongodb_collection);
        const patient = await patients.findOneAndUpdate({"mrn": patientMrn}, {$push : {"drugs": drug}});
        res.status(200).json(keysToCamel(patient));
    } catch(err) {
        console.log(err.message);
    }
});


module.exports = familyRouter;