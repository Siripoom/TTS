import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all maintenance records
 * @route   GET /api/maintenance
 * @access  Private/Admin
 */
export const getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await prisma.maintenanceCost.findMany({
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
        maintenanceDate: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance,
    });
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance records",
      error: error.message,
    });
  }
};

/**
 * @desc    Get maintenance record by ID
 * @route   GET /api/maintenance/:id
 * @access  Private/Admin
 */
export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await prisma.maintenanceCost.findUnique({
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

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    console.error("Error fetching maintenance record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance record",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new maintenance record
 * @route   POST /api/maintenance
 * @access  Private/Admin
 */
export const createMaintenance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const {
    vehicleId,
    maintenanceDate,
    itemName,
    quantity,
    cost,
    greaseDate,
    mileage,
    remark,
  } = req.body;

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

    const maintenance = await prisma.maintenanceCost.create({
      data: {
        vehicleId,
        maintenanceDate: new Date(maintenanceDate),
        itemName,
        quantity: quantity ? parseInt(quantity) : null,
        cost: cost ? parseFloat(cost) : null,
        greaseDate: greaseDate ? new Date(greaseDate) : null,
        mileage,
        remark,
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
      data: maintenance,
    });
  } catch (error) {
    console.error("Error creating maintenance record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create maintenance record",
      error: error.message,
    });
  }
};

/**
 * @desc    Update maintenance record
 * @route   PUT /api/maintenance/:id
 * @access  Private/Admin
 */
export const updateMaintenance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const {
      maintenanceDate,
      itemName,
      quantity,
      cost,
      greaseDate,
      mileage,
      remark,
    } = req.body;

    // Check if maintenance record exists
    const maintenanceExists = await prisma.maintenanceCost.findUnique({
      where: { id: req.params.id },
    });

    if (!maintenanceExists) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }

    // Prepare update data
    const updateData = {};
    if (maintenanceDate) updateData.maintenanceDate = new Date(maintenanceDate);
    if (itemName !== undefined) updateData.itemName = itemName;
    if (quantity !== undefined)
      updateData.quantity = quantity ? parseInt(quantity) : null;
    if (cost !== undefined) updateData.cost = cost ? parseFloat(cost) : null;
    if (greaseDate !== undefined)
      updateData.greaseDate = greaseDate ? new Date(greaseDate) : null;
    if (mileage !== undefined) updateData.mileage = mileage;
    if (remark !== undefined) updateData.remark = remark;

    const updatedMaintenance = await prisma.maintenanceCost.update({
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
      data: updatedMaintenance,
    });
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update maintenance record",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete maintenance record
 * @route   DELETE /api/maintenance/:id
 * @access  Private/Admin
 */
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await prisma.maintenanceCost.findUnique({
      where: { id: req.params.id },
    });

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }

    await prisma.maintenanceCost.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Maintenance record successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting maintenance record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete maintenance record",
      error: error.message,
    });
  }
};

/**
 * @desc    Get maintenance records by vehicle
 * @route   GET /api/maintenance/vehicle/:vehicleId
 * @access  Private/Admin
 */
export const getMaintenanceByVehicle = async (req, res) => {
  try {
    const maintenance = await prisma.maintenanceCost.findMany({
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
        maintenanceDate: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance,
    });
  } catch (error) {
    console.error("Error fetching vehicle maintenance records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle maintenance records",
      error: error.message,
    });
  }
};

/**
 * @desc    Get maintenance statistics
 * @route   GET /api/maintenance/stats
 * @access  Private/Admin
 */
export const getMaintenanceStats = async (req, res) => {
  try {
    // Get total maintenance cost per vehicle
    const costByVehicle = await prisma.maintenanceCost.groupBy({
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

    // Get maintenance count by type (itemName)
    const maintenanceByType = await prisma.maintenanceCost.groupBy({
      by: ["itemName"],
      _count: true,
    });

    // Get recent maintenance records
    const recentMaintenance = await prisma.maintenanceCost.findMany({
      take: 5,
      orderBy: {
        maintenanceDate: "desc",
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        costByVehicle,
        maintenanceByType,
        recentMaintenance,
      },
    });
  } catch (error) {
    console.error("Error fetching maintenance statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance statistics",
      error: error.message,
    });
  }
};
