import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // process.exit(1);
  }
};

const closeDb = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  }
};

process.on("SIGINT", async () => {
  await closeDb();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await closeDb();
  process.exit(0);
});
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await closeDb();
  process.exit(1);
});
process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection:", err);
  await closeDb();
  process.exit(1);
});

export { connectDb, closeDb };
