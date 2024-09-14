var express = require("express"); // to load the Express module
var bodyParser = require('body-parser'); // to parse request bodies
var { MongoClient } = require('mongodb'); // MongoDB client

var app = express();
app.use(bodyParser.json()); // for parsing application/json

// MongoDB Connection URL
const url = 'mongodb+srv://monickamagesh:17monmongodb@cluster0.4d6gozk.mongodb.net/';
const client = new MongoClient(url);

app.get("/myname", (req, res) => {
  res.json({"msg": "monicka"});
});

app.post("/myname", (req, res) => {
  res.json({"msg": "your post man"});
});

// app.post("/login", (req, res) => {
//   let { email, password } = req.query;
//   if (email == 'admin@gmail.com' && password == 'admin') {
//     res.json({"msg": "you are correct"});
//   } else {
//     res.json({"msg": "You are wrong"});
//   }
// });

app.post("/createTeacher", async (req, res) => {
  
    let {name,email,password,address,mobile_no} = req.body;
    let data = {
      "name": name,
      "email": email,
      "password": password,
      "address": address,
      "mobile_no": mobile_no
    };

    await client.connect();
    console.log("Connected to MongoDB server");

    let db = client.db('office');
    await db.collection('employee').insertOne(data);
    console.log("Data inserted");

    res.status(200).json({"msg": "Created!"});
  
});

app.get("/listemp", async (req, res) => {
    await client.connect();
    let db = client.db('office');
    let list = await db.collection('employee').find({}).toArray();
    res.status(200).json(list)
  });

  
app.get("/listempbyname/:name", async (req, res) => {
    await client.connect();
    let {name}= req.params;
    let db = client.db('office');
    let list = await db.collection('employee').find({"name":name}).toArray();
    res.status(200).json(list)
  });

  //always url will be consider as string even when we pass path variable value
app.get("/listempbyemail/:email/:password", async (req, res) => {
    await client.connect();
    let {email,password}= req.params;
    console.log(email, password)
    let db = client.db('office');
    let list = await db.collection('employee').find({"email":email,"password":password}).toArray();
    res.status(200).json(list)
  });

//Login
  app.post("/login", async (req, res) => {
    await client.connect();
    let {email,password}= req.body;
    let db = client.db('office');
    let list = await db.collection('employee').find({"email":email,"password":password}).toArray();
    
    if(list.length > 0){
        res.json({"msg":"you are correct"})
    }else{
        res.status(400).json({"msg":"you are wrong"})
    }
  });
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
