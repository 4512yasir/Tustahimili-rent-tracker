import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Create Expense
router.post("/", authenticate, async (req, res) => {
  try {
    const { plotId, description, amount, category } = req.body;

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        plotId,
        userId: req.user.id,
      },
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("Create expense error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Expenses (for user)
router.get("/", authenticate, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      include: { plot: true },
    });
    res.json(expenses);
  } catch (err) {
    console.error("Fetch expenses error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
