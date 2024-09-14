var { MongoClient } = require('mongodb');
const express = require("express"); // to load the Express module


var app = express();

// MongoDB Connection URL
const url = 'mongodb+srv://monickamagesh:17monmongodb@cluster0.4d6gozk.mongodb.net/';
const client = new MongoClient(url);

app.post("/createTeacher", async (req, res) => {
    let body = req.body;
    let data = {
    "name": body['name'],
    "email": body['email'],
    "password":body['password'],
    "address": body['address'],
    "mobile_no": body['mobile_no']
  };
    
    await client.connect();
    console.log("Connected to MongoDB server");
    let db = client.db('office');
    await db.collection('employee').insertOne(empData);
    console.log("Data inserted");
    res.json({"msg": "Created!"});
  
});

app.listen(8080, () => {
  console.log("server started");
});
