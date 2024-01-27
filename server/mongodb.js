const {MongoClient} = require("mongodb");
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let database;
const connectToDb = async () => {
  if (database) {
    return database;
  }
  try {
    await client.connect();
    database = client.db(process.env.MONGODB_NAME);
    return database;
  } catch(err) {
    console.log(err.message);
  }
};
module.exports = connectToDb;