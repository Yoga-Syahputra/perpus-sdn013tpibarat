const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

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

// reCAPTCHA verification route
app.post("/api/verify-captcha", async (req, res) => {
  const { captchaValue } = req.body;

  if (!captchaValue) {
    return res
      .status(400)
      .json({ success: false, message: "No CAPTCHA value provided." });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.REACT_APP_SECRET_KEY,
          response: captchaValue,
        },
      }
    );

    const { success } = response.data;

    if (!success) {
      return res
        .status(400)
        .json({ success: false, message: "CAPTCHA verification failed." });
    }

    // CAPTCHA verification passed, proceed with the logic here
    res
      .status(200)
      .json({ success: true, message: "CAPTCHA verification passed." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during CAPTCHA verification.",
      });
  }
});

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
