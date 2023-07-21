const express = require("express");
const Redis = require("ioredis");

const router = express.Router();

router.post("/addtocart", async (req, res) => {
  //open redis connection
  let redis = new Redis();
  const exists = req.body.exists;
  const data = req.body.data;
  try {
    //exists is passed down from the front end, we already know before we hit the server if the item exists in the cart or not
    if (exists) {
      //if the item exists, update the quantity, don't add any duplicates
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
      //if the item doesn't exist, go ahead and add it.
      await redis.rpush(`list:customerCart`, JSON.stringify(data));
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("failed to update cart", e);
    res.sendStatus(500);
  } finally {
    //always disconnect!
    redis.disconnect();
  }
});

router.put("/removefromcart", async (req, res) => {
  //redis connection started
  let redis = new Redis();
  const data = req.body.data;
  try {
    if (data.qty > 1) {
      //is there at least a qty of 2? If so, don't remove, just adjust the qty
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
      console.log(data);
      await redis.lset(`list:customerCart`, data.redisIndex, "DELETED");
      //if only one item exists, go ahead and remove it.
      await redis.lrem(`list:customerCart`, 1, "DELETED");
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("failed to update cart", e);
    res.sendStatus(500);
  } finally {
    //always disconnect!
    redis.disconnect();
  }
});

router.get("/", async (req, res) => {
  //redis connection started
  let redis = new Redis();
  try {
    //for simplicity sake, the name of the cart will always be customerCart. However this is easily expanded on as we'd have to do is pass in a varible and we'd have multiple customer carts. This could be tied to user accounts, ect.
    const list = await redis.lrange(`list:customerCart`, 0, -1);

    if (!list?.length) {
      //if no list exists, send a 204 and disconnect! No further action needed.
      res.sendStatus(204);
      redis.disconnect();
      return;
    }
    //defined a new varible that parses the stringified JSON object and adds the redisIndex to be used later
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
