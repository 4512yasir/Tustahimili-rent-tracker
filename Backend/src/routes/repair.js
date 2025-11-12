// routes/repairs.js
const express = require("express");
const Repair = require("../models/repair");
const auth = require("../middleware/auth");
const { isAgent } = require("../middleware/role");
const router = express.Router();

// GET all repairs
router.get("/", auth, async (req, res) => {
  try {
    let repairs;
    if (req.user.role === "agent") {
      repairs = await Repair.find({ createdBy: req.user._id }).populate("plot createdBy", "name email");
    } else {
      repairs = await Repair.find().populate("plot createdBy", "name email");
    }
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST log repair (agent only)
router.post("/", auth, isAgent, async (req, res) => {
  try {
    const repair = new Repair({ ...req.body, createdBy: req.user._id });
    await repair.save();
    res.status(201).json(repair);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
