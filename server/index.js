const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Middleware

app.use(bodyParser.json());
app.use(cors());

//express router used to help organize files and keep the structure clean.

const item = require("./routes/api/item");
const category = require("./routes/api/category");
const cart = require("./routes/api/cart");
app.use("/api/item", item);
app.use("/api/category", category);
app.use("/api/cart", cart);

// Handle Production

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
