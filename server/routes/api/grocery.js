// const express = require("express");
// const pool = require("../../pool");
// //mariadb goes here

// const router = express.Router();

// app.get("/", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const rows = await conn.query(`SELECT * from category`);
//     const jsonS = JSON.stringify(rows);
//     res.send(jsonS);
//   } catch (e) {
//     console.error(e);
//   }
// });

// module.exports = router;
