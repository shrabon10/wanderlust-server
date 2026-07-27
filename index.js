const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Wanderlust server is running');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
