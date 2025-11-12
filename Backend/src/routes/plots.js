// routes/plots.js
const express = require("express");
const Plot = require("../models/plot");
const auth = require("../middleware/auth");
const { isCommittee } = require("../middleware/role");
const router = express.Router();

// GET all plots
router.get("/", auth, async (req, res) => {
  try {
    const plots = await Plot.find().populate("assignedAgent", "name email");
    res.json(plots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plots", error: err.message });
  }
});

// POST create plot (committee only)
router.post("/", auth, isCommittee, async (req, res) => {
  try {
    const plot = new Plot(req.body);
    await plot.save();
    res.status(201).json(plot);
  } catch (err) {
    res.status(500).json({ message: "Error creating plot", error: err.message });
  }
});

// PATCH assign plot to agent (committee only)
router.patch("/:id/assign", auth, isCommittee, async (req, res) => {
  const { agentId } = req.body;
  try {
    const plot = await Plot.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId },
      { new: true }
    ).populate("assignedAgent", "name email");

    if (!plot) return res.status(404).json({ message: "Plot not found" });
    res.json(plot);
  } catch (err) {
    res.status(500).json({ message: "Error assigning plot", error: err.message });
  }
});
// DELETE plot
router.delete("/:id", auth, isCommittee, async (req, res) => {
  try {
    const plot = await Plot.findByIdAndDelete(req.params.id);
    if (!plot) return res.status(404).json({ message: "Plot not found" });
    res.json({ message: "Plot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
