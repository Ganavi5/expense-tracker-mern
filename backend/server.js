const express = require("express");

require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env. Add JWT_SECRET=your_secret to the project root .env file.");
  process.exit(1);
}

const app = express();

// middleware
const cors = require("cors");

app.use(cors({
  origin: "https://expense-tracker-mern-nu.vercel.app",
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/expenses", expenseRoutes);

const connectDB = require("./config/db");

connectDB();

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});