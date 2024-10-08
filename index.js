const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lqzgjv.mongodb.net/?retryWrites=true&w=majority`;

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

    const animalsCollection = client.db('AnimalsDB').collection('allAnimals');
    const categoryCollection = client.db('AnimalsDB').collection('allCategory');

    // get method
    app.get('/animalData', async (req, res) => {
      const result = await animalsCollection.find().toArray();
      // console.log(result);
      res.send(result);
    })
    app.get('/allCategory', async (req, res) => {
      const result = await categoryCollection.find().toArray();
      // console.log(result);
      res.send(result);
    })
   
    // post method
    app.post('/allCategory', async (req, res) => {
      const add = req.body;
      // console.log(add);
      const result = await categoryCollection.insertOne(add);
      res.send(result);
    })
    app.post('/animalData', async (req, res) => {
      const add = req.body;
      // console.log(add);
      const result = await animalsCollection.insertOne(add);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Server connected')
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
})