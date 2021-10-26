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
    // app.post("/products", async (req, res) => {});

    // get api
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await cursor.count();

      let products;
      if (page) {
        console.log(page * size, size, page);
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
