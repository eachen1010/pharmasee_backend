const express = require('express');
const { keysToCamel } = require('../common/utils');
require('dotenv').config();
const connectToDb = require('../server/mongodb');
const patients_collection = process.env.MONGODB_PATIENTS_COLLECTION;
const groups_collection = process.env.MONGODB_GROUPS_COLLECTION;

const familyRouter = express.Router();

familyRouter.get('/', async(req, res) => {
    try {
        const database = await connectToDb();
        const group = database.collection(groups_collection);
        const allPatients = await group.find().toArray();
        res.status(200).json(keysToCamel(allPatients));
    } catch(err) {
        console.log(err.message);
    }
});

// GET request for all patients in the family
familyRouter.get('/:family', async(req, res) => {
    try {
        const groupName = req.params.family;
        const database = await connectToDb();
        const groups = database.collection(groups_collection);
        const group = await groups.findOne({"name": groupName});
        let data = [];
        const patients = database.collection(patients_collection);
        await Promise.all(
            group.patients.map((mrn) => 
                patients.findOne({"mrn": mrn}).then((result) => data.push(result))
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
        const patients = database.collection(groups_collection);
        const family = await patients.findOne({"name": familyName});
        if (family.patients.includes(patientMrn)) {
            const allPatients = database.collection(patients_collection);
            const patient = await allPatients.findOne({"mrn": patientMrn} );
            res.status(200).json(keysToCamel(patient));
        } else {
            const allPatients = database.collection(patients_collection);
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
        const patients = database.collection(patients_collection);
        const family = database.collection("userGroups");
        const newPatient = await patients.insertOne({
            "mrn": mrn,
            "first_name": firstName,
            "last_name": lastName,
            "sex": sex,
            "dob": dob,
            "drugs": drugs
        });
        await family.findOneAndUpdate({"name": familyName}, {$push : {patients : mrn}})
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
        const patients = database.collection(patients_collection);
        const patient = await patients.findOneAndUpdate({"mrn": patientMrn}, {$push : {"drugs": {name: drug, dosage: "420mg"}}});
        res.status(200).json(keysToCamel(patient));
    } catch(err) {
        console.log(err.message);
    }
});

familyRouter.post('/create/:family', async (req, res) => {
    try {
        const database = await connectToDb();
        const family = req.params.family.toString();
        const groups = database.collection("userGroups");
        const newFamily = await groups.insertOne(
            {
                "patients": [],
                "name": family
            }
        )
        res.status(201).json(keysToCamel(newFamily));
    } catch(err) {
        console.log(err);
    }
})

module.exports = familyRouter;