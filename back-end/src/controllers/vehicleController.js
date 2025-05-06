import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all vehicles
 * @route   GET /api/vehicles
 * @access  Private/Admin
 */
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        Driver: true,
        TruckQueue: true,
        FuelCost: true,
        MaintenanceCost: true,
      },
    });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Private/Admin
 */
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        TruckQueue: true,
        FuelCost: true,
        MaintenanceCost: true,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new vehicle
 * @route   POST /api/vehicles
 * @access  Private/Admin
 */
export const createVehicle = async (req, res) => {

  const { plateNumber, model, capacity, driverId, type } = req.body;

  try {
    // Check if vehicle with plateNumber already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        plateNumber,
      },
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this plate number already exists",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        model,
        capacity: capacity ? parseFloat(capacity) : null,
        type,
      },
      include: {
        Driver: true
      },
    });

    console.log(vehicle)
    console.log(driverId)
    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: "Failed to create vehicle",
      });
    }

    if (driverId != null && driverId != "" && driverId != undefined) {
      const updateDriver = await prisma.driver.update({
        where: { id: driverId },
        data: {
          vehicleId: vehicle.id,
        },
      })
      if (!updateDriver) {
        return res.status(400).json({
          success: false,
          message: "Driver not found",
        });
      }
    }

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: error.message,
    });
  }
};

/**
 * @desc    Update vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Private/Admin
 */
export const updateVehicle = async (req, res) => {
  try {
    const { plateNumber, model, capacity, driverId, type } = req.body;

    // Check if vehicle exists
    const vehicleExists = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        Driver: true,
      }
    });

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }


    // If plateNumber is being changed, check it's not already in use
    if (plateNumber && plateNumber !== vehicleExists.plateNumber) {
      const plateExists = await prisma.vehicle.findUnique({
        where: { plateNumber },
      });

      if (plateExists) {
        return res.status(400).json({
          success: false,
          message: "This plate number is already in use",
        });
      }
    }

    if (vehicleExists.Driver.length === 0) {
      const updateNewDriver = await prisma.driver.update({
        where: { id: driverId },
        data: {
          vehicleId: req.params.id,
        },
      })
      if (!updateNewDriver) {
        return res.status(400).json({
          success: false,
          message: "Driver not found",
        });
      }
    } else {

      if (vehicleExists.Driver[0].id !== driverId) {
        console.log("Driver ID does not match")
        const updateNewDriver = await prisma.driver.update({
          where: { id: driverId },
          data: {
            vehicleId: req.params.id,
          },
        })
        console.log("updateNewDriver", updateNewDriver)
        if (!updateNewDriver) {
          return res.status(400).json({
            success: false,
            message: "Driver not found",
          });
        }
        if (vehicleExists.Driver[0].id !== null) {
          // Remove vehicleId from the old driver
          const updateOldDriver = await prisma.driver.update({
            where: { id: vehicleExists.Driver[0].id },
            data: {
              vehicleId: null,
            },
          })
        }
      }


    }

    // Prepare update data
    const updateData = {};
    if (plateNumber) updateData.plateNumber = plateNumber;
    if (model !== undefined) updateData.model = model;
    if (capacity !== undefined) updateData.capacity = parseFloat(capacity);
    if (type !== undefined) updateData.type = type;

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      include: {
        Driver: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Private/Admin
 */
export const deleteVehicle = async (req, res) => {
  try {
    // Check if vehicle exists and has no associated records
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        TruckQueue: true,
        FuelCost: true,
        MaintenanceCost: true,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check for associated records
    if (
      vehicle.TruckQueue.length > 0 ||
      vehicle.FuelCost.length > 0 ||
      vehicle.MaintenanceCost.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete vehicle with associated records",
      });
    }

    // Delete the vehicle
    await prisma.vehicle.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vehicle successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vehicle maintenance history
 * @route   GET /api/vehicles/:id/maintenance
 * @access  Private/Admin
 */
export const getVehicleMaintenance = async (req, res) => {
  try {
    const maintenance = await prisma.maintenanceCost.findMany({
      where: {
        vehicleId: req.params.id,
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
    console.error("Error fetching maintenance history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance history",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vehicle fuel costs
 * @route   GET /api/vehicles/:id/fuel
 * @access  Private/Admin
 */
export const getVehicleFuelCosts = async (req, res) => {
  try {
    const fuelCosts = await prisma.fuelCost.findMany({
      where: {
        vehicleId: req.params.id,
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
