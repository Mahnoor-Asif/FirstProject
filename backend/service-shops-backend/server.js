
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import axios from "axios"; 
import inventoryRoutes from "./inventory.js";
import privacyRouter from "./privacy.js";
import helpRouter from "./help.js";
import faqRouter from "./faqs.js";
const app = express();
app.use(cors());
app.use(bodyParser.json());
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/service_shop_db";

mongoose
  .connect(MONGO_URI)
  .then(() =>
    console.log(
      `✅ MongoDB connected successfully to: ${mongoose.connection.name}`
    )
  )
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );
app.get("/", (req, res) => {
  res.send(
    `✅ Service Shop Backend is running successfully on port ${
      process.env.PORT || 5002
    }!`
  );
});

// ✅ Common Login Integration (Forward to common-login microservice)
app.post("/login", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:4000/login", req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Login Error:", error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Error connecting to common-login service" });
  }
});

// ✅ Dashboard (after login)
app.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to Service Shop Dashboard" });
});

// ✅ Other APIs
app.use("/api/privacy", privacyRouter);
app.use("/api", helpRouter);
app.use("/api", faqRouter);
app.use("/inventory", inventoryRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Service Shop backend running on port ${PORT}`);
});
