import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import Job from "./models/Job.js";
import multer from 'multer';



import signupRoutes from "./signup.js";

const app = express();
const PORT = 5004;
const MONGO_URI = "mongodb://127.0.0.1:27017/serviceProviderDB";

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ---------------- ROUTES ----------------

// Get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get job by ID
app.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Job ID is required" });

  try {
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Invalid Job ID" });
  }
});

// Create new job
app.post("/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

// Update job by ID
app.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Job ID is required" });

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ error: "Job not found" });
    res.json(updatedJob);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Invalid Job ID" });
  }
});

// Delete job by ID
app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Job ID is required" });

  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Invalid Job ID" });
  }
});
const upload = multer({ storage: multer.memoryStorage() });
app.use("/uploads", express.static("uploads")); // serve images
app.use("/api", signupRoutes);

import skillsRoutes from './skills.js'; //  // m// import skills.js
app.use('/api', skillsRoutes);
import certificateRoutes from './certificate.js';
app.use('/api', certificateRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
