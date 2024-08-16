const express = require("express");
const router = express.Router();
const Guru = require("../models/Guru");

// Get all gurus (admins)
router.get("/guru", async (req, res) => {
  try {
    const gurus = await Guru.find();
    res.json(gurus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new guru (admin)
router.post("/guru", async (req, res) => {
  const guru = new Guru({
    nama: req.body.nama,
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const newGuru = await guru.save();
    res.status(201).json(newGuru);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a guru (admin)
router.delete("/guru/:id", async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (guru == null) {
      return res.status(404).json({ message: "Cannot find admin" });
    }
    await Guru.deleteOne({ _id: req.params.id });  
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update password for a specific guru (admin)
router.put("/guru/:id/password", async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (!guru) {
      return res.status(404).json({ message: "Guru not found" });
    }
    
    guru.password = req.body.password;
    await guru.save();
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint for Guru Login
router.post("/guru/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const guru = await Guru.findOne({ username });

    if (!guru || guru.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const token = "some-generated-token";

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
