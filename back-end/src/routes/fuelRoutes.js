import express from "express";
import {
  getAllFuelCosts,
  getFuelCostById,
  createFuelCost,
  updateFuelCost,
  deleteFuelCost,
  getFuelCostsByVehicle,
  getFuelCostStats,
} from "../controllers/fuelController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const fuelCostValidation = [
  body("vehicleId")
    .notEmpty()
    .withMessage("Vehicle ID is required")
    .isUUID()
    .withMessage("Invalid vehicle ID format"),

  body("fuelStation")
    .notEmpty()
    .withMessage("Fuel station is required")
    .isIn(["station_1", "station_2"])
    .withMessage("Invalid fuel station"),

  body("cost")
    .notEmpty()
    .withMessage("Cost is required")
    .isFloat({ min: 0 })
    .withMessage("Cost must be a positive number"),

  body("date").optional().isISO8601().withMessage("Invalid date format"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Basic CRUD routes
router.get("/", getAllFuelCosts);
router.get("/stats", getFuelCostStats);
router.get("/vehicle/:vehicleId", getFuelCostsByVehicle);
router.get("/:id", getFuelCostById);
router.post("/", fuelCostValidation, createFuelCost);
router.put("/:id", fuelCostValidation, updateFuelCost);
router.delete("/:id", deleteFuelCost);

export default router;
