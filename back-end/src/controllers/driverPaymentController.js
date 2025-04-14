import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all driver payments
 * @route   GET /api/driver-payments
 * @access  Private/Admin/Accountant
 */
export const getAllDriverPayments = async (req, res) => {
  try {
    const payments = await prisma.driverPayment.findMany({
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        truckQueue: {
          include: {
            vehicle: true,
            customer: true,
            supplier: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching driver payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver payments",
      error: error.message,
    });
  }
};

/**
 * @desc    Calculate and create driver payment for a queue
 * @route   POST /api/driver-payments/calculate
 * @access  Private/Admin/Accountant
 */
export const calculateDriverPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { queueId, baseFare, overnightBonus = 0, deductions = 0 } = req.body;

  try {
    // Get queue details
    const queue = await prisma.truckQueue.findUnique({
      where: { id: queueId },
      include: {
        driver: true,
        vehicle: true,
        customer: true,
      },
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Truck queue not found",
      });
    }

    if (!queue.driverId) {
      return res.status(400).json({
        success: false,
        message: "No driver assigned to this queue",
      });
    }

    if (queue.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot calculate payment for incomplete queue",
      });
    }

    // Check if payment already exists
    const existingPayment = await prisma.driverPayment.findFirst({
      where: { queueId },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this queue",
      });
    }

    // Calculate final payment
    const finalPayment =
      parseFloat(baseFare) +
      parseFloat(overnightBonus) -
      parseFloat(deductions);

    // Create payment record
    const payment = await prisma.driverPayment.create({
      data: {
        driverId: queue.driverId,
        queueId,
        baseFare: parseFloat(baseFare),
        overnightBonus: parseFloat(overnightBonus),
        deductions: parseFloat(deductions),
        finalPayment,
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
        truckQueue: {
          include: {
            vehicle: true,
            customer: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error calculating driver payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate driver payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/driver-payments/:id
 * @access  Private/Admin/Accountant
 */
export const getPaymentById = async (req, res) => {
  try {
    const payment = await prisma.driverPayment.findUnique({
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
        truckQueue: {
          include: {
            vehicle: true,
            customer: true,
            supplier: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Update driver payment
 * @route   PUT /api/driver-payments/:id
 * @access  Private/Admin/Accountant
 */
export const updatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { baseFare, overnightBonus, deductions } = req.body;

  try {
    // Calculate new final payment
    const finalPayment =
      parseFloat(baseFare) +
      parseFloat(overnightBonus) -
      parseFloat(deductions);

    const updatedPayment = await prisma.driverPayment.update({
      where: {
        id: req.params.id,
      },
      data: {
        baseFare: parseFloat(baseFare),
        overnightBonus: parseFloat(overnightBonus),
        deductions: parseFloat(deductions),
        finalPayment,
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
        truckQueue: {
          include: {
            vehicle: true,
            customer: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Get driver payment summary
 * @route   GET /api/driver-payments/driver/:driverId/summary
 * @access  Private/Admin/Accountant/Driver
 */
export const getDriverPaymentSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const payments = await prisma.driverPayment.findMany({
      where: {
        driverId: req.params.driverId,
        ...dateFilter,
      },
      include: {
        truckQueue: {
          include: {
            vehicle: true,
            customer: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate summary
    const summary = {
      totalEarnings: payments.reduce((sum, p) => sum + p.finalPayment, 0),
      totalTrips: payments.length,
      totalBonus: payments.reduce((sum, p) => sum + p.overnightBonus, 0),
      totalDeductions: payments.reduce((sum, p) => sum + p.deductions, 0),
      payments,
    };

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment summary",
      error: error.message,
    });
  }
};

/**
 * @desc    Get payment statistics
 * @route   GET /api/driver-payments/stats
 * @access  Private/Admin/Accountant
 */
export const getPaymentStats = async (req, res) => {
  try {
    // Get total payments by driver
    const paymentsByDriver = await prisma.driverPayment.groupBy({
      by: ["driverId"],
      _sum: {
        finalPayment: true,
        overnightBonus: true,
        deductions: true,
      },
      _count: true,
      include: {
        driver: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get monthly payment totals
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM("finalPayment") as total_payments,
        COUNT(*) as payment_count
      FROM "DriverPayment"
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    res.status(200).json({
      success: true,
      data: {
        paymentsByDriver,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment statistics",
      error: error.message,
    });
  }
};
