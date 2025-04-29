import express from "express";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleMaintenance,
  getVehicleFuelCosts,
} from "../controllers/vehicleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const vehicleValidation = [
  // body("plateNumber")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Plate number is required")
  //   .matches(/^[A-Z0-9-]+$/)
  //   .withMessage("Invalid plate number format"),

  body("model")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Model name must be between 1 and 100 characters"),

  body("capacity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Capacity must be a positive number"),

  body("driverId").optional().isUUID().withMessage("Invalid driver ID format"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Basic CRUD routes
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", vehicleValidation, createVehicle);
router.put("/:id", vehicleValidation, updateVehicle);
router.delete("/:id", deleteVehicle);

// Additional routes for vehicle-related data
router.get("/:id/maintenance", getVehicleMaintenance);
router.get("/:id/fuel", getVehicleFuelCosts);

export default router;
