import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all truck queues
 * @route   GET /api/queues
 * @access  Private/Admin
 */
export const getTruckQueues = async (req, res) => {
  try {
    const queues = await prisma.truckQueue.findMany({
      include: {
        customer: true,
        vehicle:true,
        driver: true,
        supplier:true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: queues.length,
      data: queues,
    });
  } catch (error) {
    console.error("Error fetching truck queues:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch truck queues",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single truck queue by ID
 * @route   GET /api/queues/:id
 * @access  Private/Admin
 */
export const getTruckQueueById = async (req, res) => {
  try {
    const queue = await prisma.truckQueue.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        customer: true,
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplier: true,
        DriverPayment: true,
        InvoiceItem: true,
      },
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Truck queue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (error) {
    console.error("Error fetching truck queue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch truck queue",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new truck queue
 * @route   POST /api/queues
 * @access  Private/Admin
 */
export const createTruckQueue = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   console.log("Validation errors:", errors.array());
  //   return res.status(400).json({
  //     success: false,
  //     errors: errors.array(),

  //   });
  // }

  const {
    customerId,
    vehicleId,
    driverId,
    supplierId,
    distanceKm,
    tripType,
    overnight,
  } = req.body;

  try {
    // Verify all related entities exist
    const [customer, vehicle, driver, supplier] = await Promise.all([
      prisma.customer.findUnique({ where: { id: customerId } }),
      vehicleId
        ? prisma.vehicle.findUnique({ where: { id: vehicleId } })
        : true,
      driverId ? prisma.driver.findUnique({ where: { id: driverId } }) : true,
      prisma.supplier.findUnique({ where: { id: supplierId } }),
    ]);

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (vehicleId && !vehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (driverId && !driver) {
      return res.status(400).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (!supplier) {
      return res.status(400).json({
        success: false,
        message: "Supplier not found",
      });
    }

    // Create truck queue
    const queue = await prisma.truckQueue.create({
      data: {
        customerId,
        vehicleId,
        driverId,
        supplierId,
        distanceKm: distanceKm ? parseFloat(distanceKm) : null,
        tripType: tripType || "full_delivery",
        overnight: overnight || false,
        status: "pending",
      },
      include: {
        customer: true,
        vehicle: true,
        driver: true,
        supplier: true,
      },
    });

    res.status(201).json({
      success: true,
      data: queue,
    });
  } catch (error) {
    console.error("Error creating truck queue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create truck queue",
      error: error.message,
    });
  }
};

/**
 * @desc    Update truck queue
 * @route   PUT /api/queues/:id
 * @access  Private/Admin
 */
export const updateTruckQueue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { vehicleId, driverId, status, distanceKm, tripType, overnight } =
      req.body;

    // Check if queue exists
    const queueExists = await prisma.truckQueue.findUnique({
      where: { id: req.params.id },
    });

    if (!queueExists) {
      return res.status(404).json({
        success: false,
        message: "Truck queue not found",
      });
    }

    // Verify related entities if provided
    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
      if (!vehicle) {
        return res.status(400).json({
          success: false,
          message: "Vehicle not found",
        });
      }
    }

    if (driverId) {
      const driver = await prisma.user.findUnique({ where: { id: driverId } });
      if (!driver || driver.role !== "driver") {
        return res.status(400).json({
          success: false,
          message: "Invalid driver ID or user is not a driver",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (vehicleId !== undefined) updateData.vehicleId = vehicleId;
    if (driverId !== undefined) updateData.driverId = driverId;
    if (status !== undefined) updateData.status = status;
    if (distanceKm !== undefined)
      updateData.distanceKm = parseFloat(distanceKm);
    if (tripType !== undefined) updateData.tripType = tripType;
    if (overnight !== undefined) updateData.overnight = overnight;

    // Update queue
    const updatedQueue = await prisma.truckQueue.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      include: {
        customer: true,
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplier: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedQueue,
    });
  } catch (error) {
    console.error("Error updating truck queue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update truck queue",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete truck queue
 * @route   DELETE /api/queues/:id
 * @access  Private/Admin
 */
export const deleteTruckQueue = async (req, res) => {
  try {
    // Check if queue exists and has no associated records
    const queue = await prisma.truckQueue.findUnique({
      where: { id: req.params.id },
      include: {
        DriverPayment: true,
        InvoiceItem: true,
      },
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Truck queue not found",
      });
    }

    // Check for associated records
    if (queue.DriverPayment.length > 0 || queue.InvoiceItem.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete queue with associated payments or invoices",
      });
    }

    // Delete the queue
    await prisma.truckQueue.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Truck queue successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting truck queue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete truck queue",
      error: error.message,
    });
  }
};

/**
 * @desc    Update truck queue status
 * @route   PATCH /api/queues/:id/status
 * @access  Private/Admin
 */
export const updateQueueStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const updatedQueue = await prisma.truckQueue.update({
      where: {
        id: req.params.id,
      },
      data: {
        status,
      },
      include: {
        customer: true,
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplier: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedQueue,
    });
  } catch (error) {
    console.error("Error updating queue status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update queue status",
      error: error.message,
    });
  }
};

/**
 * @desc    Get queues by customer
 * @route   GET /api/queues/customer/:customerId
 * @access  Private/Admin
 */
export const getQueuesByCustomer = async (req, res) => {
  try {
    const queues = await prisma.truckQueue.findMany({
      where: {
        customerId: req.params.customerId,
      },
      include: {
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: queues.length,
      data: queues,
    });
  } catch (error) {
    console.error("Error fetching customer queues:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer queues",
      error: error.message,
    });
  }
};

/**
 * @desc    Get queues by driver
 * @route   GET /api/queues/driver/:driverId
 * @access  Private/Admin
 */
export const getQueuesByDriver = async (req, res) => {
  try {
    const queues = await prisma.truckQueue.findMany({
      where: {
        driverId: req.params.driverId,
      },
      include: {
        customer: true,
        vehicle: true,
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: queues.length,
      data: queues,
    });
  } catch (error) {
    console.error("Error fetching driver queues:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver queues",
      error: error.message,
    });
  }
};
