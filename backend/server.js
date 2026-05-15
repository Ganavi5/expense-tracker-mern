const express = require("express");
const cors = require("cors");
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env");
  process.exit(1);
}

const app = express();

// ✅ CORS (FINAL FIX)
app.use(cors({
  origin: "https://expense-tracker-mern-nu.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Handle preflight for all routes
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://expense-tracker-mern-nu.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.sendStatus(200);
});

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes
const connectDB = require("./config/db");
connectDB();

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ IMPORTANT: REMOVE /api TO MATCH FRONTEND CALLS
app.use("/expenses", expenseRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});