import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { generateToken } from "../Helper/tokenHelper.js";

const prisma = new PrismaClient();

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
        Vehicle: true,
        TruckQueue: true,
        DriverPayment: true,
        AdvancePayment: true,
        TrafficFine: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Public (for registration) or Private/Admin (for user creation)
 */
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "customer", // Default role from schema
      },
    });

    // Generate token with user ID and role
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, email, role, password } = req.body;

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    // Check if user exists first
    const userExists = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "User successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle foreign key constraint violations
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user because it is referenced by other records",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all drivers (users with role = 'driver')
 * @route   GET /api/users/drivers
 * @access  Private/Admin/Accountant
 */
export const getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.user.findMany({
      where: {
        role: "driver",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        Vehicle: true,
      },
    });

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
      error: error.message,
    });
  }
};
