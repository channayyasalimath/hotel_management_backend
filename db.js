//Database connection
const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/hotels";

mongoose
  .connect(dbURI, { useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const db = mongoose.connection;

module.exports = db;

