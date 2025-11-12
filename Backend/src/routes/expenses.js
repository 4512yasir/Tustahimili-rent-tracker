// routes/expenses.js
const express = require("express");
const Expense = require("../models/expense");
const auth = require("../middleware/auth");
const { isAgent } = require("../middleware/role");
const router = express.Router();

// GET all expenses
router.get("/", auth, async (req, res) => {
  try {
    let expenses;
    if (req.user.role === "agent") {
      expenses = await Expense.find({ createdBy: req.user._id }).populate("plot createdBy", "name email");
    } else {
      expenses = await Expense.find().populate("plot createdBy", "name email");
    }
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add expense (agent only)
router.post("/", auth, isAgent, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, createdBy: req.user._id });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
