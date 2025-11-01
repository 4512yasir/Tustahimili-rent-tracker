import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Request Repair
router.post("/", authenticate, async (req, res) => {
  try {
    const { plotId, description, imageUrl } = req.body;

    const repair = await prisma.repair.create({
      data: {
        description,
        imageUrl,
        agentId: req.user.id,
        plotId,
        status: "pending",
      },
    });

    res.status(201).json(repair);
  } catch (err) {
    console.error("Create repair error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Repairs for Current User
router.get("/", authenticate, async (req, res) => {
  try {
    const repairs = await prisma.repair.findMany({
      where: { agentId: req.user.id },
      include: { plot: true },
    });
    res.json(repairs);
  } catch (err) {
    console.error("Fetch repairs error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Repair Status
router.put("/:id", authenticate, async (req, res) => {
  try {
    const repair = await prisma.repair.update({
      where: { id: req.params.id },
      data: { status: req.body.status || "completed" },
    });
    res.json(repair);
  } catch (err) {
    console.error("Update repair error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
