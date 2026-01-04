import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  price: { type: Number, required: true },
  photos: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ["accepted", "arriving", "arrived", "started", "completed"], 
    default: "accepted" 
  },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

export default Job;
