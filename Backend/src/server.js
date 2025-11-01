import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import plotRoutes from "./routes/plots.js";
import authRoutes from "./routes/auth.js";
import rentRoutes from "./routes/rent.js";
import repairRoutes from "./routes/repair.js";
import expenseRoutes from "./routes/expenses.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/plots", plotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rents", rentRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MongoDB");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
});
