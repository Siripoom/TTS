import express from "express";
import {
  getTruckQueues,
  getTruckQueueById,
  createTruckQueue,
  updateTruckQueue,
  deleteTruckQueue,
  updateQueueStatus,
  getQueuesByCustomer,
  getQueuesByDriver,
} from "../controllers/truckQueueController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const queueValidation = [
  body("customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isUUID()
    .withMessage("Invalid customer ID format"),

  body("supplierId")
    .notEmpty()
    .withMessage("Supplier ID is required")
    .isUUID()
    .withMessage("Invalid supplier ID format"),

  body("vehicleId")
    .optional()
    .isUUID()
    .withMessage("Invalid vehicle ID format"),

  body("driverId").optional().isUUID().withMessage("Invalid driver ID format"),

  body("distanceKm")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Distance must be a positive number"),

  body("tripType")
    .optional()
    .isIn(["full_delivery", "only_loading"])
    .withMessage("Invalid trip type"),

  body("overnight")
    .optional()
    .isBoolean()
    .withMessage("Overnight must be a boolean value"),
];

const statusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in_progress", "completed", "canceled"])
    .withMessage("Invalid status"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Basic CRUD routes
router.get("/", getTruckQueues);
router.get("/:id", getTruckQueueById);
router.post("/", queueValidation, createTruckQueue);
router.put("/:id", queueValidation, updateTruckQueue);
router.delete("/:id", deleteTruckQueue);

// Additional routes
router.patch("/:id/status", statusValidation, updateQueueStatus);
router.get("/customer/:customerId", getQueuesByCustomer);
router.get("/driver/:driverId", getQueuesByDriver);

export default router;
