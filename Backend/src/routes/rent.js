const express = require("express");
const RentPayment = require("../models/rent");
const Plot = require("../models/plot");
const auth = require("../middleware/auth");
const { isAgent } = require("../middleware/role");

const router = express.Router();

// GET all rents (committee sees all, agent sees own)
router.get("/", auth, async (req, res) => {
  try {
    let rents;
    if (req.user.role === "agent") {
      rents = await RentPayment.find({ user: req.user._id }).populate("plot user", "name email");
    } else {
      rents = await RentPayment.find().populate("plot user", "name email");
    }
    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add rent (agent only)
router.post("/", auth, isAgent, async (req, res) => {
  try {
    const { plot, amount, tenantName } = req.body;

    const plotData = await Plot.findById(plot);
    if (!plotData) return res.status(404).json({ message: "Plot not found" });
    if (!plotData.assignedAgent || plotData.assignedAgent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not assigned to this plot" });
    }

    const rent = new RentPayment({
      plot,
      user: req.user._id,
      amount,
      tenantName,
      status: "unpaid",
    });

    await rent.save();
    res.status(201).json(rent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH mark rent as paid
router.patch("/:id/mark-paid", auth, async (req, res) => {
  try {
    const rent = await RentPayment.findById(req.params.id);
    if (!rent) return res.status(404).json({ message: "Rent not found" });

    // Only committee or rent owner can mark as paid
    if (req.user.role !== "committee" && rent.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    rent.status = "paid";
    await rent.save();
    res.json(rent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT edit rent (committee can edit all, agent can edit own)
router.put("/:id", auth, async (req, res) => {
  try {
    const rent = await RentPayment.findById(req.params.id);
    if (!rent) return res.status(404).json({ message: "Rent not found" });

    if (req.user.role !== "committee" && rent.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { tenantName, amount, status } = req.body;
    if (tenantName) rent.tenantName = tenantName;
    if (amount) rent.amount = amount;
    if (status && req.user.role === "committee") rent.status = status; // only committee can set status manually

    await rent.save();
    res.json(rent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE rent (committee can delete all, agent can delete own)
router.delete("/:id", auth, async (req, res) => {
  try {
    const rent = await RentPayment.findById(req.params.id);
    if (!rent) return res.status(404).json({ message: "Rent not found" });

    if (req.user.role !== "committee" && rent.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await RentPayment.findByIdAndDelete(req.params.id);
    res.json({ message: "Rent deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
