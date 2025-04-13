import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const supplierValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Supplier name is required")
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

// Routes with authentication
// Apply authMiddleware to all routes that need authentication
router.use(authMiddleware);

// GET all suppliers
router.get("/", getSuppliers);

// GET supplier by ID
router.get("/:id", getSupplierById);

// POST create new supplier
router.post("/", supplierValidation, createSupplier);

// PUT update supplier
router.put("/:id", supplierValidation, updateSupplier);

// DELETE supplier
router.delete("/:id", deleteSupplier);

export default router;
