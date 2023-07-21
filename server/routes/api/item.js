const express = require("express");
const pool = require("../../pool");

const router = express.Router();

router.get("/:category_id", (req, res) => {
  //only query the items assocated with the category_id
  pool
    .query("SELECT * from items where category_id=$1", [req.params.category_id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error("Error GET /items", error);
      res.sendStatus(500);
    });
});

module.exports = router;
