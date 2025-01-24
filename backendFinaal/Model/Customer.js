const mongoose = require("mongoose");

// Base schema with common fields
const BaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    service: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["shopkeeper", "executive"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    discriminatorKey: "role", // Key to differentiate between discriminators
    collection: process.env.MONGODB_USER_COLLECTION, // Collection name from environment variable
  }
);

// Base model
const User = mongoose.model("User", BaseSchema);

// Schema for 'Executive' role
const ExecutiveSchema = new mongoose.Schema({
  executiveOf: {
    type: String,
    required: true,
  },
});

// Schema for 'Shopkeeper' role
const ShopkeeperSchema = new mongoose.Schema({
 
});

// Discriminator models
const Executive = User.discriminator("executive", ExecutiveSchema);
const Shopkeeper = User.discriminator("shopkeeper", ShopkeeperSchema);

module.exports = { User, Executive, Shopkeeper };
