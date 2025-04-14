import express from "express";
import {
  setOvernightStatus,
  getOvernightStats,
  getDriverOvernightTrips,
} from "../controllers/overnightBonusController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdminOrAccountant from "../middlewares/isAdminOrAccountant.js";
import { body, query } from "express-validator";

const router = express.Router();

// Validation rules
const overnightStatusValidation = [
  body("overnight")
    .isBoolean()
    .withMessage("Overnight status must be a boolean"),

  body("bonusAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Bonus amount must be a positive number"),
];

const dateRangeValidation = [
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

// Routes
router.put(
  "/overnight/:queueId",
  isAdminOrAccountant,
  overnightStatusValidation,
  setOvernightStatus
);

router.get("/overnight/stats", isAdminOrAccountant, getOvernightStats);

router.get(
  "/overnight/driver/:driverId",
  dateRangeValidation,
  getDriverOvernightTrips
);

export default router;
