import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./config/db.js"; // นำ Prisma Client มาใช้
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoute.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import truckQueueRoutes from "./routes/truckQueueRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/truck-queues", truckQueueRoutes);

// ทดสอบ API Health Check
app.get("/", async (req, res) => {
  try {
    // ทดสอบการเชื่อมต่อกับ DB
    await prisma.$connect();
    res.json({ message: "API is running!" });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
