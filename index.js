const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.Port || 5000;
const { MongoClient } = require("mongodb");

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6mulb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("emaJhon");
    const productCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    // app.post("/products", async (req, res) => {});

    // get api
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await cursor.count();

      let products;
      if (page) {
        // console.log(page * size, size, page);
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send({
        count,
        products,
      });
    });

    app.post("/products/byKeys", async (req, res) => {
      const keys = req.body;
      const query = { key: { $in: keys } };
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });
    // add order api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const resutl = await ordersCollection.insertOne(order);
      res.send(resutl);
    });
    console.log("database connect");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>This is Ema-John Server</h1>");
});

app.listen(port, () => {
  console.log("succesfully run by", port);
});
