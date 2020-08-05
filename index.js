const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const { subscriptionDao } = require("./db");

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/push/:userId/subscribe", async (req, res) => {
  const subscription = req.body;

  await subscriptionDao.insert({ ...subscription, userId: req.params.userId });
  res.status(201).json({ success: true });
});

app.delete("/push/:userId/unsubscribe", async (req, res) => {
  const { userId } = req.params;
  const numRemoved = await subscriptionDao.deleteByUserId(userId).catch(console.error);
  res.status(200).json({ success: true, numRemoved });
});

app.post("/push/:userId", async (req, res) => {
  const { userId } = req.params;
  const { subscription, notification } = req.body;
  const payload = JSON.stringify(notification);

  const subscriptions = await subscriptionDao.findByUserId(userId);
  const pushPromises = subscriptions.map((subscription) => {
    return webpush
      .sendNotification(subscription, payload)
      .catch((err) => console.error(err));
  });

  await Promise.all(pushPromises);

  return res.status(201).json({ success: true });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
