const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import Admin model
const Admin = require("./models/Admin");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const updateAdminPassword = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Find the admin
    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) {
      console.log("Admin not found");
      return;
    }

    // Hash the password and update the admin record
    admin.password = await hashPassword(admin.password);
    await admin.save();

    console.log("Admin password hashed and updated successfully");
  } catch (error) {
    console.error("Error updating admin password:", error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
};

// Run the function
updateAdminPassword();
