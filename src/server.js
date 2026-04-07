const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require("cors");


require('dotenv').config();

app.use(express.json());
app.use(cors());

// TODO: replace with your own MongoDB connection string
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("Connected"))
  .catch(err => console.error("Error: ", err));

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/urls", async (req, res) => {
  const newUrl = await Url.create({
    originalUrl: req.body.originalUrl,
    shortCode: req.body.shortCode,
  });

  res.json(newUrl);
});

app.get("/api/urls", async (req, res) => {
  const urls = await Url.find();
  res.json(urls);
});

app.get("/api/urls/:id", async (req, res) => {
  const url = await Url.findById(req.params.id);
  res.json(url);
});

app.get("/:shortCode", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.shortCode });

  if (!url) {
    return res.send("Not found");
  }

  url.clicks += 1;
  await url.save();

  res.redirect(url.originalUrl);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});

