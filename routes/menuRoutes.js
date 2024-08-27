const express = require("express");
const router = express.Router();

//Menu Model importing
const MenuItem = require("../models/MenuItem");

//Menu Routes
//Menu Post method
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);

    const response = await newMenuItem.save();
    console.log("MenuItem Data saved");
    res.status(500).json(response);
  } catch (err) {
    console.log(err);
    res.status(200).json({ err: "Internal error" });
  }
});

//Menu Get Method
router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("MenuItem Fetched");
    res.status(500).json(data);
  } catch (err) {
    console.log(err);
    res.status(200).json({ err: "Internal error" });
  }
});

//Menu Get Method Taste
router.get("/:tasteType", async (req, res) => {
  try {
    const tasteType = req.params.tasteType;

    if (tasteType == "sweet" || tasteType == "spicy" || tasteType == "sour") {
      const response = await MenuItem.find({ taste: tasteType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json("Invalid tasteType");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Invalid error" });
  }
});

//Menu Update
router.put("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const updatedMenuData = req.body;
    console.log(`Updating MenuItem with ID: ${menuId}`);
    console.log(`Updated data: ${JSON.stringify(updatedMenuData)}`);
    const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      res.status(404).json("Menu Not Found");
    } else {
      console.log("Menu Data Updated");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Invalid Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const response = await MenuItem.findByIdAndDelete(menuId);
    if (!response) {
      res.status(404).json("Menu Not Found");
    } else {
      console.log("Data Deleted");
      res.status(200).json({ message: "Menu Data Deleted Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Invalid error" });
  }
});

module.exports = router;
