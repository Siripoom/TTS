import express from "express";
import {
  requestAdvancePayment,
  processAdvancePayment,
  getDriverAdvances,
  recordTrafficFine,
  updateFineStatus,
  getDriverFines,
  getAdvanceAndFineStats,
} from "../controllers/advanceAndFineController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdminOrAccountant from "../middlewares/isAdminOrAccountant.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const advancePaymentValidation = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
];

const processAdvanceValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected"])
    .withMessage("Invalid status"),
];

const trafficFineValidation = [
  body("driverId")
    .notEmpty()
    .withMessage("Driver ID is required")
    .isUUID()
    .withMessage("Invalid driver ID format"),

  body("amount")
    .notEmpty()
    .withMessage("Fine amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("issuedDate")
    .notEmpty()
    .withMessage("Issue date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

const fineStatusValidation = [
  body("paid").isBoolean().withMessage("Paid status must be a boolean"),

  body("deductedFromSalary")
    .isBoolean()
    .withMessage("Deduction status must be a boolean"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Advance Payment Routes
router.post(
  "/advances/request",
  advancePaymentValidation,
  requestAdvancePayment
);
router.put(
  "/advances/:id/process",
  isAdminOrAccountant,
  processAdvanceValidation,
  processAdvancePayment
);
router.get("/advances/driver/:driverId", getDriverAdvances);
router.get("/advances/stats", isAdminOrAccountant, getAdvanceAndFineStats);

// Traffic Fine Routes
router.post(
  "/fines/record",
  isAdminOrAccountant,
  trafficFineValidation,
  recordTrafficFine
);
router.put(
  "/fines/:id/status",
  isAdminOrAccountant,
  fineStatusValidation,
  updateFineStatus
);
router.get("/fines/driver/:driverId", getDriverFines);

export default router;
