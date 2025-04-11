import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerInvoices,
  getCustomerQueues,
} from "../controllers/customerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const customerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("pricePerTrip")
    .notEmpty()
    .withMessage("Price per trip is required")
    .isFloat({ min: 0 })
    .withMessage("Price per trip must be a positive number"),

  body("contactInfo").optional().trim(),

  body("address").optional().trim(),
];

// All routes use authentication middleware
router.use(authMiddleware);

// Basic CRUD routes
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", customerValidation, createCustomer);
router.put("/:id", customerValidation, updateCustomer);
router.delete("/:id", deleteCustomer);

// Additional routes
router.get("/:id/invoices", getCustomerInvoices);
router.get("/:id/queues", getCustomerQueues);

export default router;
