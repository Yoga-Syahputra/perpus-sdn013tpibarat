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
app.use(cors());
app.use(express.json());

app.use("/api/visitors", require("./routes/VisitorRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
