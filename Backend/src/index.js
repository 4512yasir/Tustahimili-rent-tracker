const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const plotRoutes = require("./routes/plots");
const rentRoutes = require("./routes/rent");       
const repairRoutes = require("./routes/repair");   
const expenseRoutes = require("./routes/expenses");
const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/rents", rentRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Tustahimili na Lulu Rent Tracker API is running");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
