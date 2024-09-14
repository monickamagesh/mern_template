const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb+srv://monickamagesh:17monmongodb@cluster0.4d6gozk.mongodb.net/';
const client = new MongoClient(url);

// Database Name
const dbName = 'office';

async function insertData() {
  let empData = {
    "name" : "Monicka",
    "mobile" : "8825545956",
    "address" : "95 A Yadava street padi chennai-50"
  }

  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(dbName);
  const collection =await db.collection('employee');
    await collection.insertOne(empData);
    console.log("inserted");

}
insertData()