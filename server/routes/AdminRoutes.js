// routes/AdminRoutes.js
const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

const router = express.Router();

// Endpoint for admin login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin based on username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
