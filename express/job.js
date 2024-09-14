var express = require("express");
var app = express();
var jwt = require("jsonwebtoken")
app.use(express.json()); // middleware function
app.use('/api/',(req, res, next) => {
    let {token} = req.headers;
if(token == "" || token == undefined ){
    res.json({"msg" : "please send the token"})
    
}else{
    jwt.verify(token , 'SECRET')
    next();
    console.log(token)
}
});//middleware

var { MongoClient, ObjectId } = require('mongodb'); // import ObjectId

const url = 'mongodb+srv://monickamagesh:17monmongodb@cluster0.4d6gozk.mongodb.net/';
const client = new MongoClient(url);
const dbName = 'job_portal';

var cors = require("cors");
app.use(cors());

// create
app.post('/api/createJob', async (req, res) => {
    var { name, company_name, requirements } = req.body;
    await client.connect();
    let db = client.db(dbName);
    db.collection("jobs").insertOne({
        "name": name,
        "company_name": company_name,
        "requirements": requirements
    });
    res.json({ "msg": "job created" });
})

// read
app.get("/api/listJob", async (req, res) => {
    await client.connect();
    let dbName = 'job_portal';
    let db = client.db(dbName);
    let data = await db.collection('jobs').find({}).toArray();
    res.status(200).json(data)
});

app.delete("/api/delete", async (req, res) => {
    await client.connect();
    let db = client.db(dbName);
    let { id } = req.query;
    await db.collection('jobs').deleteOne({ "_id": new ObjectId(id) });
    res.json({ "msg": "job deleted" });
    
});

app.post('/api/updateJob',async(req,res)=>{
    let {id,name,company_name,requirements} = req.body;
    await client.connect();
    console.log(id,name,company_name,requirements);
    let db = client.db("job_portals");
    await db.collection("jobs").updateOne( {"_id":new ObjectId(id)},{$set:{"name":name,"company_name":company_name,"requirements":requirements}});
    res.json({"msg":"updated"});
})


app.post("/createUser", async (req, res) => {
  
    let {name,email,password} = req.body;
    let data = {
      "name": name,
      "email": email,
      "password": password
    };

    await client.connect();
    console.log("Connected to MongoDB server");

    let db = client.db('job_portal');
    await db.collection('employee').insertOne(data);
    console.log("Data inserted");

    res.status(200).json({"msg": "Created!"});
  
});
//Login
app.post("/login", async (req, res) => {
    await client.connect();
    let {email,password}= req.body;
    let db = client.db('job_portal');
    let logInRes = await db.collection('employee').find({"email":email,"password":password}).toArray();
    
    if(logInRes.length > 0){
        var token = jwt.sign({"name": logInRes[0]['name']}, "SECRET");
        res.json({"msg":"you are correct", "token": token})
    }else{
        res.status(400).json({"msg":"you are wrong"})
    }
});

app.listen(8080, () => {
    console.log("server started")
})
