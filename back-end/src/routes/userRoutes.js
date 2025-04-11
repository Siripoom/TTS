import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/", createUser);

export default router;
