const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
}));

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

    const db = client.db("wanderlust");
    const destinationsCollection = db.collection("destinations");

    app.get('/featured', async (req, res) =>{
        const result = await destinationsCollection.find().limit(9).toArray();
        res.json(result)
    })

    app.get('/destinations', async (req, res) =>{
        const result = await destinationsCollection.find().toArray();
        res.json(result);
    })


    app.delete('/destinations/:id', async (req, res) => {
        const {id} = req.params;
        const result = await destinationsCollection.deleteOne({_id: new ObjectId(id)})
        res.json(result);
    })

    app.post('/destinations', async (req, res) =>{
        const destination = req.body;
        console.log(destination);
        const result = await destinationsCollection.insertOne(destination);
        res.json(result);
    })
        app.patch("/destinations/:id", async (req, res) => {
        const { id } = req.params;
        const updatedData = req.body;

        delete updatedData._id;

        const result = await destinationsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
            $set: updatedData,
            }
        );

        res.json(result);
        console.log(result);
        });

    app.get('/destinations/:id', async (req, res) =>{
        const { id } = req.params;
        const result = await destinationsCollection.findOne({_id: new ObjectId(id)});
        res.json(result);
    });





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Wanderlust server is running');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
