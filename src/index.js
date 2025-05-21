import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDb } from "./config/db/connectDb.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(morgan("dev"));

// Routes
app.use("/api", productRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
