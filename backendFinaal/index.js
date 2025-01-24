const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Connection = require("./Connection");
const dotenv = require("dotenv").config();
// const User = require("./Model/User");

const { User, Shopkeeper, Executive } = require("./Model/Customer");

const app = express();
app.use(express.json());
app.use(cors());

Connection();


const shopkeeperRoutes = require("./Routes/Shopkeeper");

app.use("/api/v1", shopkeeperRoutes);

app.post("/fetchAccount", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await User.findOne({ email });
    if (!result) {
      return res
        .status(404)
        .send({ message: "Account not found related to this mail" });
    }
    // Convert the result to a plain object to avoid circular structure issues
    const plainResult = result.toObject();
    return res
      .status(201)
      .send({ message: "Fetched successfully", result: plainResult });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
});

app.get("/fetchAllAccount", async (req, res) => {
  try {
    const result = await User.find();
    return res
      .status(202)
      .json({ message: "Fetched all data successfully", result });
  } catch (error) {}
});

app.post("/CreateAccount", async (req, res) => {
  const { name, phone, email, password, city } = req.body;
  if (!name || !phone || !email || !password || !city) {
    return res.status(404).send({ message: "all fields are required" });
  }
  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return res.status(404).send({ message: "user alredy exist" });
  }
  const result = await User.create({ name, phone, email, password, city });
  return res
    .status(201)
    .send({ message: "Account created successfully", result });
});

app.put("/updateAccount/:id", async (req, res) => {
  const { name, phone, city, password, email } = req.body;
  const { id } = req.params;
  if (!id) {
    return res.status(404).send({ message: "id not found" });
  }
  if (!name || !phone || !city || !password || !email) {
    return res.status(404).send({ message: "all fields are required" });
  }
  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return res.status(404).send({ message: "email is already registred" });
  }
  const result = await User.updateOne(
    { _id: id },
    { $set: { name, phone, email, password, city } }
  );
  return res
    .status(201)
    .send({ message: "Account updated successfully", result });
});

app.delete("/deleteAccount/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).send({ message: "id is not found" });
  }
  const existinguser = await User.findOne({ _id: id });
  if (!existinguser) {
    return res.status(404).send({ message: "User is not found" });
  }
  const result = await User.deleteOne({ _id: id });
  return res.status(202).send({ message: "Account deleted successfully" });
});

const PORT = process.env.PORT_NO || 5000;
app.listen(PORT, () => console.log(`Server started at: ${PORT}`));
