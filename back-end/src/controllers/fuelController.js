import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all fuel costs
 * @route   GET /api/fuel
 * @access  Private/Admin
 */
export const getAllFuelCosts = async (req, res) => {
  try {
    const fuelCosts = await prisma.fuelCost.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            model: true,
            driver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: fuelCosts.length,
      data: fuelCosts,
    });
  } catch (error) {
    console.error("Error fetching fuel costs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel costs",
      error: error.message,
    });
  }
};

/**
 * @desc    Get fuel cost by ID
 * @route   GET /api/fuel/:id
 * @access  Private/Admin
 */
export const getFuelCostById = async (req, res) => {
  try {
    const fuelCost = await prisma.fuelCost.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            model: true,
            driver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!fuelCost) {
      return res.status(404).json({
        success: false,
        message: "Fuel cost record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fuelCost,
    });
  } catch (error) {
    console.error("Error fetching fuel cost:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel cost",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new fuel cost record
 * @route   POST /api/fuel
 * @access  Private/Admin
 */
export const createFuelCost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { vehicleId, fuelStation, cost, date } = req.body;

  try {
    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const fuelCost = await prisma.fuelCost.create({
      data: {
        vehicleId,
        fuelStation,
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date(),
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            model: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: fuelCost,
    });
  } catch (error) {
    console.error("Error creating fuel cost record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create fuel cost record",
      error: error.message,
    });
  }
};

/**
 * @desc    Update fuel cost record
 * @route   PUT /api/fuel/:id
 * @access  Private/Admin
 */
export const updateFuelCost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { fuelStation, cost, date } = req.body;

    // Check if fuel cost record exists
    const fuelCostExists = await prisma.fuelCost.findUnique({
      where: { id: req.params.id },
    });

    if (!fuelCostExists) {
      return res.status(404).json({
        success: false,
        message: "Fuel cost record not found",
      });
    }

    // Prepare update data
    const updateData = {};
    if (fuelStation !== undefined) updateData.fuelStation = fuelStation;
    if (cost !== undefined) updateData.cost = parseFloat(cost);
    if (date) updateData.date = new Date(date);

    const updatedFuelCost = await prisma.fuelCost.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            model: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedFuelCost,
    });
  } catch (error) {
    console.error("Error updating fuel cost record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update fuel cost record",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete fuel cost record
 * @route   DELETE /api/fuel/:id
 * @access  Private/Admin
 */
export const deleteFuelCost = async (req, res) => {
  try {
    const fuelCost = await prisma.fuelCost.findUnique({
      where: { id: req.params.id },
    });

    if (!fuelCost) {
      return res.status(404).json({
        success: false,
        message: "Fuel cost record not found",
      });
    }

    await prisma.fuelCost.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Fuel cost record successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting fuel cost record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete fuel cost record",
      error: error.message,
    });
  }
};

/**
 * @desc    Get fuel costs by vehicle
 * @route   GET /api/fuel/vehicle/:vehicleId
 * @access  Private/Admin
 */
export const getFuelCostsByVehicle = async (req, res) => {
  try {
    const fuelCosts = await prisma.fuelCost.findMany({
      where: {
        vehicleId: req.params.vehicleId,
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            model: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: fuelCosts.length,
      data: fuelCosts,
    });
  } catch (error) {
    console.error("Error fetching vehicle fuel costs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle fuel costs",
      error: error.message,
    });
  }
};

/**
 * @desc    Get fuel cost statistics
 * @route   GET /api/fuel/stats
 * @access  Private/Admin
 */
export const getFuelCostStats = async (req, res) => {
  try {
    // Get total fuel cost per vehicle
    const costByVehicle = await prisma.fuelCost.groupBy({
      by: ["vehicleId"],
      _sum: {
        cost: true,
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
          },
        },
      },
    });

    // Get fuel costs by station
    const costByStation = await prisma.fuelCost.groupBy({
      by: ["fuelStation"],
      _sum: {
        cost: true,
      },
      _count: true,
    });

    // Get monthly fuel costs
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', date) as month,
        SUM(cost) as total_cost,
        COUNT(*) as refuel_count
      FROM "FuelCost"
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month DESC
      LIMIT 12
    `;

    res.status(200).json({
      success: true,
      data: {
        costByVehicle,
        costByStation,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching fuel cost statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel cost statistics",
      error: error.message,
    });
  }
};
