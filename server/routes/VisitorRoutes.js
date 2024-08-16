const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// POST api/visitors - Create a new visitor
router.post("/", async (req, res) => {
  try {
    const newVisitor = new Visitor(req.body);
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET api/visitors - Get all visitors
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT api/visitors/:id - Update a visitor
router.put("/:id", async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, 
        runValidators: true, 
      }
    );
    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json(updatedVisitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE api/visitors/:id - Delete a visitor
router.delete("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
