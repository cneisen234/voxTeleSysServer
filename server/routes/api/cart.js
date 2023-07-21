const express = require("express");
const Redis = require("ioredis");

const router = express.Router();

router.post("/addtocart", async (req, res) => {
  let redis = new Redis();
  const exists = req.body.exists;
  const data = req.body.data;
  try {
    if (exists) {
      let updatedData = {
        id: data.id,
        itemName: data.itemName,
        qty: Number(data.qty) + 1,
        redisIndex: data.redisIndex,
      };
      await redis.lset(
        `list:customerCart`,
        data.redisIndex,
        JSON.stringify(updatedData)
      );
    } else {
      await redis.rpush(`list:customerCart`, JSON.stringify(data));
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("failed to update cart", e);
    res.sendStatus(500);
  } finally {
    redis.disconnect();
  }
});

router.put("/removefromcart", async (req, res) => {
  let redis = new Redis();
  const data = req.body.data;
  try {
    if (data.qty > 1) {
      let updatedData = {
        id: data.id,
        itemName: data.itemName,
        qty: Number(data.qty) - 1,
        redisIndex: data.redisIndex,
      };
      await redis.lset(
        `list:customerCart`,
        data.redisIndex,
        JSON.stringify(updatedData)
      );
    } else {
      await redis.lrem(`list:customerCart`, 1, JSON.stringify(data));
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("failed to update cart", e);
    res.sendStatus(500);
  } finally {
    redis.disconnect();
  }
});

router.get("/", async (req, res) => {
  let redis = new Redis();
  try {
    const list = await redis.lrange(`list:customerCart`, 0, -1);

    if (!list?.length) {
      res.sendStatus(204);
      redis.disconnect();
      return;
    }

    const parsedList = list.map((l, i) => ({
      data: { ...JSON.parse(l), redisIndex: i },
    }));
    res.send(parsedList).status(200);
  } catch (e) {
    console.error("failed to fetch from redis", e);
    res.sendStatus(500);
  } finally {
    redis.disconnect();
  }
});

module.exports = router;
