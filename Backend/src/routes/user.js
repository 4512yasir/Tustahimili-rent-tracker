// routes/users.js
const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { isCommittee } = require("../middleware/role");
const router = express.Router();

// GET all agents (committee only)
router.get("/", auth, isCommittee, async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("name email role");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
