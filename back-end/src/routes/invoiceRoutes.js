import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  getBillingStats,
} from "../controllers/invoiceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdminOrAccountant from "../middlewares/isAdminOrAccountant.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const invoiceValidation = [
  body("customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isUUID()
    .withMessage("Invalid customer ID format"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("items")
    .isArray()
    .withMessage("Items must be an array")
    .notEmpty()
    .withMessage("At least one item is required"),

  body("items.*.queueId")
    .notEmpty()
    .withMessage("Queue ID is required")
    .isUUID()
    .withMessage("Invalid queue ID format"),

  body("items.*.amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
];

const statusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["unpaid", "paid", "overdue"])
    .withMessage("Invalid status"),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(isAdminOrAccountant);

// Basic CRUD routes
router.get("/", getAllInvoices);
router.get("/stats", getBillingStats);
router.get("/:id", getInvoiceById);
router.post("/", invoiceValidation, createInvoice);
router.patch("/:id/status", statusValidation, updateInvoiceStatus);
router.delete("/:id", deleteInvoice);

export default router;
