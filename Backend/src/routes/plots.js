import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authmiddleware.js"; // ✅ correct file name + casing

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Create a plot (protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, location, size, rentAmount } = req.body;

    const plot = await prisma.plot.create({
      data: {
        name,
        location,
        size,
        rentAmount,
        ownerId: req.user.id, // ✅ link to the logged-in user
      },
    });

    res.status(201).json(plot);
  } catch (err) {
    console.error("Create plot error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all plots (protected)
router.get("/", authenticate, async (req, res) => {
  try {
    const plots = await prisma.plot.findMany({
      where: { ownerId: req.user.id }, // ✅ correct field name
    });
    res.json(plots);
  } catch (err) {
    console.error("Get plots error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get one plot (protected)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const plot = await prisma.plot.findUnique({
      where: { id: req.params.id },
    });

    if (!plot) return res.status(404).json({ message: "Plot not found" });
    if (plot.ownerId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    res.json(plot);
  } catch (err) {
    console.error("Get single plot error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
