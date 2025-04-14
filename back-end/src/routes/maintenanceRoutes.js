import express from "express";
import {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceByVehicle,
  getMaintenanceStats,
} from "../controllers/maintenanceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const maintenanceValidation = [
  body("vehicleId")
    .notEmpty()
    .withMessage("Vehicle ID is required")
    .isUUID()
    .withMessage("Invalid vehicle ID format"),

  body("maintenanceDate")
    .notEmpty()
    .withMessage("Maintenance date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("itemName")
    .notEmpty()
    .withMessage("Item name is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Item name must be between 2 and 100 characters"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost must be a positive number"),

  body("greaseDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid grease date format"),

  body("mileage")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Mileage must not exceed 50 characters"),

  body("remark")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remark must not exceed 500 characters"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Basic CRUD routes
router.get("/", getAllMaintenance);
router.get("/stats", getMaintenanceStats);
router.get("/vehicle/:vehicleId", getMaintenanceByVehicle);
router.get("/:id", getMaintenanceById);
router.post("/", maintenanceValidation, createMaintenance);
router.put("/:id", maintenanceValidation, updateMaintenance);
router.delete("/:id", deleteMaintenance);

export default router;
