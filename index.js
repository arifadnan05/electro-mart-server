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



    // app.get('/products', async (req, res) => {
    //   const filter = req.query;
    //   const query = {
    //     price : {$lt: 150}
    //   }
    //   const options = {
    //     sort: {
    //       price: filter.sort === 'asc' ? 1 : -1
    //     }
    //   }
    //   const page = parseInt(req.query.page)
    //   const size = parseInt(req.query.size)
    //   const result = await productsCollection.find(query, options)
    //   .skip(page * size)
    //   .limit(size)
    //   .toArray()
    //   res.send(result)
    // })

    app.get('/products', async (req, res) => {
      const filter = req.query;
      let query = {};
  
      // Price range filtering
      if (filter.minPrice || filter.maxPrice) {
          query.price = {};
          if (filter.minPrice) {
              query.price.$gte = parseInt(filter.minPrice); // Greater than or equal to minPrice
          }
          if (filter.maxPrice) {
              query.price.$lte = parseInt(filter.maxPrice); // Less than or equal to maxPrice
          }
      }
  
      const options = {
          sort: {
              price: filter.sort === 'asc' ? 1 : -1
          }
      };
  
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;
  
      const result = await productsCollection.find(query, options)
          .skip(page * size)
          .limit(size)
          .toArray();
  
      res.send(result);
  });
  

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