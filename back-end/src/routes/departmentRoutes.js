import express from "express";
import {
  getDepartmentsByCustomer,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
} from "../controllers/departmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
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

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Department routes
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.put("/:id", departmentValidation, updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
