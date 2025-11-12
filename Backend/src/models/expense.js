// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: "Plot", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  amount: Number,
  expenseDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);