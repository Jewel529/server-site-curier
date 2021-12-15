const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
var cors = require("cors");
require("dotenv").config(); //env setup
//middleware setup
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0ciw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);
async function run() {
  try {
    await client.connect();
    console.log("mogodb connected");

    //database and collection setup in mongodb
    const database = client.db("courierService");
    const servicesCollection = database.collection("Services");
    const orders = database.collection("Orders");

    //get api to set data to backend server from database

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      //console.log(services);
      res.send(services);
    });
    //post api for insert data from client site to database
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      console.log("got newService", newService);
      console.log("user services information", result);
      res.json(result);
    });
    //get api to set order data to backend server
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orders.find(query);
      const services = await cursor.toArray();
      //console.log(services);
      res.send(services);
    });
    //post api to set order data oin mongodb data
    app.post("/orders", async (req, res) => {
      const newService = req.body;
      const result = await orders.insertOne(newService);
      console.log("got newService", newService);
      console.log("user services information", result);
      res.json(result);
    });

    //delete order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delte order id", id);
      const query = { _id: ObjectId(id) };
      const result = await orders.deleteOne(query);
      console.log("deleting count", result);
      res.json(result);
    });
  } finally {
    //  await client.close()
  }
}
run().catch(console.dir);
//check is server is runnig
app.get("/", (req, res) => {
  res.send("courier server runnig");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
