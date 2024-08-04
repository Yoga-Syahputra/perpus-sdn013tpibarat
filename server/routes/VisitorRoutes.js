const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor"); 

// POST api/visitors
router.post("/", async (req, res) => {
  try {
    const newVisitor = new Visitor(req.body);
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET api/visitors
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
