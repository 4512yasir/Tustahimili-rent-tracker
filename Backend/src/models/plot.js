// models/Plot.js
const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema({
  name: String,
  location: String,
  units: Number,
  description: String,
  rentAmount: Number,
  status: { type: String, enum: ["available","occupied","under-repair"], default: "available" },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Plot", plotSchema);
