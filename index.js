const express = require("express");
const cors = require("cors");
require('dotenv').config();
// require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ylhegt.mongodb.net/?retryWrites=true&w=majority`;


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

        const brandCollection = client.db('brandDB').collection('brand');
        const cartsCollection = client.db('brandDB').collection('carts');
        const userCollection = client.db('brandDB').collection('user');


        //get all product
        app.get('/product', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        //get one  product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await brandCollection.findOne(query);
            res.send(result);
        })

        //post product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await brandCollection.insertOne(newProduct);
            res.send(result);
        })
        //post cart
        app.post('/carts', async (req, res) => {
            const newCart = req.body;
            const result = await cartsCollection.insertOne(newCart);
            res.send(result);
        })
        // get all cart
        app.get('/carts', async (req, res) => {
            const cursor = cartsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // get one cart
        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartsCollection.findOne(query);
            res.send(result);
        })

        // //delete one cart
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        })


        //
        //update
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            const Coffee = {
                $set: {
                    name: updateProduct.name,
                    brandName: updateProduct.brandName,
                    type: updateProduct.type,
                    image: updateProduct.image,
                    price: updateProduct.price,
                    description: updateProduct.description,
                    rating: updateProduct.rating

                }
            }
            const result = await brandCollection.updateOne(filter, Coffee, options);
            res.send(result);
        })


        // post user
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })
        // patch 
        app.patch('/users', async (req, res) => {
            const newUser = req.body;
            const filter = { email: newUser.email };
            const updatedDoc = {
                $set: {
                    lastLogAt:newUser.lastLogAt,
                    displayName:newUser.displayName,
                    displayName: newUser.displayName,
                    photoURL:newUser.photoURL
                }
            }
            const result = await userCollection.updateOne(filter,updatedDoc);
            res.send(result);
        })
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
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



app.get('/', (req, res) => {
    res.send("Coffee-store-server running");
});


app.listen(port, () => {
    console.log(`coffee store running on port :${port}`);
});
