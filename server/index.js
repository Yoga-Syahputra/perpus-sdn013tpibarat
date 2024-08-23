const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "https://perpus-sdn013tpibarat.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// API routes for visitors
app.use("/api/visitors", require("./routes/VisitorRoutes"));

// API routes for admin
app.use("/api/admin", require("./routes/AdminRoutes"));

// API routes for guru
const guruRoutes = require("./routes/GuruRoutes");
app.use("/api", guruRoutes);

// Start the server
module.exports = app;
