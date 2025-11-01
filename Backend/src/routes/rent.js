import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Create Rent Record
router.post("/", authenticate, async (req, res) => {
  try {
    const { plotId, month, amount, status } = req.body;

    const rent = await prisma.rent.create({
      data: {
        month,
        amount,
        status: status || "pending",
        agentId: req.user.id,
        plotId,
      },
    });

    res.status(201).json(rent);
  } catch (err) {
    console.error("Create rent error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get All Rents (for this user)
router.get("/", authenticate, async (req, res) => {
  try {
    const rents = await prisma.rent.findMany({
      where: { agentId: req.user.id },
      include: { plot: true },
    });
    res.json(rents);
  } catch (err) {
    console.error("Fetch rents error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Rent Status (mark as paid)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const rent = await prisma.rent.update({
      where: { id: req.params.id },
      data: { status: "paid", paidAt: new Date() },
    });
    res.json(rent);
  } catch (err) {
    console.error("Update rent error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
