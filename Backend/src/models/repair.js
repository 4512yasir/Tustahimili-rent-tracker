// models/Repair.js
const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: "Plot", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  cost: Number,
  status: { type: String, enum: ["pending","completed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Repair", repairSchema);