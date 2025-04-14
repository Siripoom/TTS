import express from "express";
import {
  getAllDriverPayments,
  calculateDriverPayment,
  getPaymentById,
  updatePayment,
  getDriverPaymentSummary,
  getPaymentStats,
} from "../controllers/driverPaymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdminOrAccountant from "../middlewares/isAdminOrAccountant.js";
import { body, query } from "express-validator";

const router = express.Router();

// Validation rules
const paymentValidation = [
  body("queueId")
    .notEmpty()
    .withMessage("Queue ID is required")
    .isUUID()
    .withMessage("Invalid queue ID format"),

  body("baseFare")
    .notEmpty()
    .withMessage("Base fare is required")
    .isFloat({ min: 0 })
    .withMessage("Base fare must be a positive number"),

  body("overnightBonus")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Overnight bonus must be a positive number"),

  body("deductions")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Deductions must be a positive number"),
];

const updatePaymentValidation = [
  body("baseFare")
    .notEmpty()
    .withMessage("Base fare is required")
    .isFloat({ min: 0 })
    .withMessage("Base fare must be a positive number"),

  body("overnightBonus")
    .notEmpty()
    .withMessage("Overnight bonus is required")
    .isFloat({ min: 0 })
    .withMessage("Overnight bonus must be a positive number"),

  body("deductions")
    .notEmpty()
    .withMessage("Deductions are required")
    .isFloat({ min: 0 })
    .withMessage("Deductions must be a positive number"),
];

const summaryValidation = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date format"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes that require admin or accountant access
router.use(["/", "/stats", "/calculate"], isAdminOrAccountant);

// Basic routes
router.get("/", getAllDriverPayments);
router.get("/stats", getPaymentStats);
router.post("/calculate", paymentValidation, calculateDriverPayment);
router.get("/:id", getPaymentById);
router.put("/:id", updatePaymentValidation, updatePayment);

// Driver-specific route (accessible by the driver themselves)
router.get(
  "/driver/:driverId/summary",
  summaryValidation,
  getDriverPaymentSummary
);

export default router;
