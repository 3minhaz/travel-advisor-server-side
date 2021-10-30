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
        const bookingCollection = database.collection("user_booking");
        //GET all API
        app.get('/manageAllOrders', async (req, res) => {
            const cursor = await serviceCollection.find({}).toArray();
            // console.log(cursor);
            res.json(cursor);
        })
        //GET Single API
        app.get('/book/:id', async (req, res) => {
            const result = await serviceCollection.findOne({ _id: ObjectId(req.params.id) });
            res.json(result);
        })
        //GET booking individual user
        app.get('/myOrder/:email', async (req, res) => {
            // console.log('request', req.params.email);
            // console.log(bookingCollection);
            const cursor = await bookingCollection.find({}).toArray();
            const findEmail = cursor.filter(book => book.email === req.params.email)
            // console.log(findEmail);
            // console.log(cursor);
            res.json(findEmail);

        })
        app.get('/myOrder', async (req, res) => {
            // console.log('request', req.params.email);
            // console.log(bookingCollection);
            const cursor = await bookingCollection.find({}).toArray();

            // console.log(findEmail);
            // console.log(cursor);
            res.json(cursor);

        })
        //DELETE user order
        app.delete('/myOrder/:id', async (req, res) => {
            const result = await bookingCollection.deleteOne({ _id: ObjectId(req.params.id) });
            console.log(result);
            res.send(result);
        })

        //POST booking
        app.post('/booking', async (req, res) => {
            // console.log(req.body);
            const result = await bookingCollection.insertOne(req.body);
            res.json(result);
        })

        //POST services
        app.post('/addNewService', async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.json(result);
        })
        //update status
        app.put('/updateStatus/:id', async (req, res) => {
            console.log(req.params.id);
            const filter = { _id: ObjectId(req.params.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'approved'
                }
            }
            res.send('hitting')
        })
        //DELETE service
        app.delete('/manageService/:id', async (req, res) => {

            const result = await bookingCollection.deleteOne({ _id: ObjectId(req.params.id) })
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