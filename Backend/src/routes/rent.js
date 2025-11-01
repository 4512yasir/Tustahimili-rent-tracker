import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * ✅ Create Rent Record
 * Authenticated user (agent/landlord) records rent for a plot
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { tenant, plotId, amount, dueDate, paid } = req.body;

    if (!tenant || !plotId || !amount || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const rent = await prisma.rent.create({
      data: {
        tenant,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        paid: paid || false,
        agentId: req.user.id,
        plotId,
      },
      include: {
        plot: true,
      },
    });

    res.status(201).json({
      message: "Rent record created successfully",
      rent,
    });
  } catch (err) {
    console.error("Create rent error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Get All Rents (for authenticated agent)
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const rents = await prisma.rent.findMany({
      where: { agentId: req.user.id },
      include: {
        plot: {
          select: {
            name: true,
            location: true,
            rentAmount: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(rents);
  } catch (err) {
    console.error("Fetch rents error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Get Single Rent Record
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const rent = await prisma.rent.findUnique({
      where: { id: req.params.id },
      include: { plot: true },
    });

    if (!rent) return res.status(404).json({ message: "Rent record not found" });
    if (rent.agentId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    res.json(rent);
  } catch (err) {
    console.error("Get rent error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Update Rent (mark as paid or update fields)
 */
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { paid } = req.body;

    const rent = await prisma.rent.findUnique({
      where: { id: req.params.id },
    });

    if (!rent) return res.status(404).json({ message: "Rent record not found" });
    if (rent.agentId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    const updatedRent = await prisma.rent.update({
      where: { id: req.params.id },
      data: {
        paid: paid === true,
        paidAt: paid ? new Date() : null,
      },
      include: { plot: true },
    });

    res.json({
      message: "Rent record updated successfully",
      rent: updatedRent,
    });
  } catch (err) {
    console.error("Update rent error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Delete Rent Record
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const rent = await prisma.rent.findUnique({
      where: { id: req.params.id },
    });

    if (!rent) return res.status(404).json({ message: "Rent not found" });
    if (rent.agentId !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    await prisma.rent.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Rent deleted successfully" });
  } catch (err) {
    console.error("Delete rent error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Summary: Rents grouped by Plot (for dashboard charts)
 */
router.get("/summary/by-plot", authenticate, async (req, res) => {
  try {
    const { month, year } = req.query;

    let dateFilter = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      dateFilter = {
        createdAt: {
          gte: start,
          lte: end,
        },
      };
    }

    const plots = await prisma.plot.findMany({
      where: { ownerId: req.user.id },
      select: {
        id: true,
        name: true,
        location: true,
        rentAmount: true,
        rents: {
          where: dateFilter,
          select: {
            amount: true,
            paid: true,
          },
        },
      },
    });

    const summary = plots.map((plot) => {
      const totalRents = plot.rents.length;
      const totalCollected = plot.rents
        .filter((r) => r.paid)
        .reduce((sum, r) => sum + r.amount, 0);
      const totalPending = plot.rents
        .filter((r) => !r.paid)
        .reduce((sum, r) => sum + r.amount, 0);

      return {
        plotId: plot.id,
        name: plot.name,
        location: plot.location,
        rentAmount: plot.rentAmount,
        totalRents,
        totalCollected,
        totalPending,
      };
    });

    res.json({
      message: "✅ Rent summary by plot retrieved successfully",
      summary,
    });
  } catch (err) {
    console.error("Summary by plot error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Dashboard Overview
 * Provides quick KPI metrics for dashboard cards
 */
router.get("/summary/overview", authenticate, async (req, res) => {
  try {
    // All rents by agent
    const rents = await prisma.rent.findMany({
      where: { agentId: req.user.id },
    });

    const plotsCount = await prisma.plot.count({
      where: { ownerId: req.user.id },
    });

    const tenants = [
      ...new Set(rents.map((r) => r.tenant?.trim().toLowerCase())),
    ].filter(Boolean);

    const totalCollected = rents
      .filter((r) => r.paid)
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPending = rents
      .filter((r) => !r.paid)
      .reduce((sum, r) => sum + r.amount, 0);

    res.json({
      message: "✅ Dashboard overview generated successfully",
      data: {
        totalCollected,
        totalPending,
        totalPlots: plotsCount,
        totalTenants: tenants.length,
      },
    });
  } catch (err) {
    console.error("Overview summary error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
