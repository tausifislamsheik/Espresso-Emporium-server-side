const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ioiqom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeesCollection = client.db("coffeeDB").collection("coffees");
    const usersCollection = client.db("coffeeDB").collection("usersProfile");

    app.get('/coffees', async (req, res)=>{
        const result = await coffeesCollection.find().toArray();
        res.send(result)
    })

    app.get('/coffees/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeesCollection.findOne(query);
        res.send(result);
    })

    app.post('/coffees', async (req, res)=>{
        const newCoffee = req.body;
        const result = await coffeesCollection.insertOne(newCoffee);
        res.send(result);
    })

    app.put('/coffees/:id', async (req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updatedCoffee = req.body;
        const updateDoc ={
            $set:updatedCoffee
        } 
        const result = await coffeesCollection.updateOne(filter, updateDoc, options)
        res.send(result)
    })

    app.delete('/coffees/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeesCollection.deleteOne(query);
        res.send(result);
    })

    // User profile data APIs

    app.get('/users-profile', async(req,res)=>{
        const result = await usersCollection.find().toArray();
        res.send(result)
    })

    app.get('/users-profile/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.findOne(query);
        res.send(result);
    })

    app.post('/users-profile', async (req, res)=>{
        const userData = req.body;
        const result = await usersCollection.insertOne(userData);
        res.send(result);
    })

    app.put('/users-profile/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedUser = req.body;
      const updatedDoc = {
        $set:updatedUser
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options)
      res.send(result);
    })

    app.patch('/users-profile', async (req, res)=>{
        const {email, lastSignInTime} = req.body;
        const filter = {email:email};
        const updatedDoc = {
          $set:{
            lastSignInTime:lastSignInTime
          }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc);
        res.send(result)
    })

    app.delete('/users-profile/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}

run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Coffee server is getting hotter!')
})

app.listen(port, ()=>{
    console.log(`Coffee server is getting hotter on ${port}!`)
})