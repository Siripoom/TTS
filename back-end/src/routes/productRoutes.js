import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductStats,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdminOrAccountant from "../middlewares/isAdminOrAccountant.js";
import { body } from "express-validator";

const router = express.Router();

// Validation rules
const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 50 })
    .withMessage("Category must not exceed 50 characters"),

  body("costPrice")
    .notEmpty()
    .withMessage("Cost price is required")
    .isFloat({ min: 0 })
    .withMessage("Cost price must be a positive number"),

  body("sellingPrice")
    .notEmpty()
    .withMessage("Selling price is required")
    .isFloat({ min: 0 })
    .withMessage("Selling price must be a positive number")
    .custom((value, { req }) => {
      if (parseFloat(value) < parseFloat(req.body.costPrice)) {
        throw new Error("Selling price cannot be less than cost price");
      }
      return true;
    }),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(isAdminOrAccountant);

// Basic CRUD routes
router.get("/", getAllProducts);
router.get("/stats", getProductStats);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);
router.post("/", productValidation, createProduct);
router.put("/:id", productValidation, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
