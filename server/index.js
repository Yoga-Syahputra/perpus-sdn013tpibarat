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
// Configure CORS to allow requests only from frontend URL
app.use(
  cors({
    origin: "https://perpus-sdn013tpibarat.vercel.app",
    optionsSuccessStatus: 200,
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

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
