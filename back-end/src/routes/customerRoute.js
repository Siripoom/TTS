import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerInvoices,
  getCustomerQueues,
  getCustomerDepartments,
  createCustomerDepartment,
} from "../controllers/customerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules for customers
const customerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("contactInfo")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Contact info must not exceed 200 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must not exceed 500 characters"),
];

// Validation rules for departments
const departmentValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Department type is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Department type must be between 2 and 50 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("Unit must be between 1 and 20 characters"),

  body("contactInfo")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Contact info must not exceed 200 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must not exceed 500 characters"),
];

// All routes use authentication middleware
router.use(authMiddleware);

// Customer CRUD routes
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", customerValidation, createCustomer);
router.put("/:id", customerValidation, updateCustomer);
router.delete("/:id", deleteCustomer);

// Customer related data routes
router.get("/:id/invoices", getCustomerInvoices);
router.get("/:id/queues", getCustomerQueues);

// Department routes for specific customer
router.get("/:id/departments", getCustomerDepartments);
router.post("/:id/departments", departmentValidation, createCustomerDepartment);

export default router;
