const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qq0tl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Traveller");
        const serviceCollection = database.collection("all_services");
        //GET all API
        app.get('/manageAllOrders', async (req, res) => {
            const cursor = await serviceCollection.find({}).toArray();
            console.log(cursor);
            res.json(cursor);
        })

        //POST services
        app.post('/addNewService', async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.json(result);
        })
        //DELETE service
        app.delete('/manageService/:id', async (req, res) => {

            const result = await serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log('listening to port', port);
})