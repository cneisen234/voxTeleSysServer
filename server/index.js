const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Middleware

app.use(bodyParser.json());
app.use(cors());

const item = require("./routes/api/item");
const category = require("./routes/api/category");
app.use("/api/item", item);
app.use("/api/category", category);

// Handle Production

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
