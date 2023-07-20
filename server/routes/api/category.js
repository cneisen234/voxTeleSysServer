const express = require("express");
const pool = require("../../pool");

const router = express.Router();

router.get("/", (req, res) => {
  pool
    .query("SELECT * from category")
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error("Error GET /category", error);
      res.sendStatus(500);
    });
});

module.exports = router;
