const mongoose = require("mongoose");

//Define Menu scheme
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  taste: {
    type: String,
    enum: ["sweet", "spicy", "sour"],
  },
  is_drink: {
    type: Boolean,
    default: false,
  },
  ingredients: {
    type: [String],
    default: [],
  },
  num_sales: {
    type: Number,
    default: 0,
  },
});

//Create Menu Model
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

//Export Menu Model
module.exports = MenuItem;
