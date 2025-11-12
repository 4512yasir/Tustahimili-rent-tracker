const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: "Plot", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tenantName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("RentPayment", rentSchema);
