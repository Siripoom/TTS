import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  createDriver,
  getDriver,
  updateDriver,

} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/drivers", getDriver);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/", createUser);


router.post("/driver", createDriver);
router.put("/driver/:id", updateDriver);

export default router;
