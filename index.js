const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 4000;


//middleware 

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://electro-marts.netlify.app"
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8lcgwxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const productsCollection = client.db('electro-mart').collection('products')



    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      console.log(req.query)
      const result = await productsCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray()
      res.send(result)
    })

    app.get('/products-count', async (req, res) => {
      const count = await productsCollection.estimatedDocumentCount();
      res.send({ count })
    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Electro Mart server is running')
})
app.listen(port, () => {
  console.log(`Electro Mart server is running on port ${port}`)
})