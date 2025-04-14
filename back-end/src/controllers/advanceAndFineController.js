import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Request advance payment
 * @route   POST /api/advances/request
 * @access  Private/Driver
 */
export const requestAdvancePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { amount } = req.body;
  const driverId = req.user.id; // Get driver ID from authenticated user

  try {
    // Check if driver has pending advance payment
    const pendingAdvance = await prisma.advancePayment.findFirst({
      where: {
        driverId,
        status: "pending",
      },
    });

    if (pendingAdvance) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending advance payment request",
      });
    }

    // Create advance payment request
    const advance = await prisma.advancePayment.create({
      data: {
        driverId,
        amount: parseFloat(amount),
        status: "pending",
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: advance,
    });
  } catch (error) {
    console.error("Error requesting advance payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to request advance payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Process advance payment request
 * @route   PUT /api/advances/:id/process
 * @access  Private/Admin/Accountant
 */
export const processAdvancePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { status } = req.body;

  try {
    const advance = await prisma.advancePayment.update({
      where: {
        id: req.params.id,
      },
      data: {
        status,
        approvedAt: status === "approved" ? new Date() : null,
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: advance,
    });
  } catch (error) {
    console.error("Error processing advance payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process advance payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Get driver's advance payment history
 * @route   GET /api/advances/driver/:driverId
 * @access  Private/Admin/Accountant/Driver
 */
export const getDriverAdvances = async (req, res) => {
  try {
    const advances = await prisma.advancePayment.findMany({
      where: {
        driverId: req.params.driverId,
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: advances.length,
      data: advances,
    });
  } catch (error) {
    console.error("Error fetching advance payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advance payments",
      error: error.message,
    });
  }
};

/**
 * @desc    Record traffic fine
 * @route   POST /api/fines/record
 * @access  Private/Admin/Accountant
 */
export const recordTrafficFine = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { driverId, amount, issuedDate } = req.body;

  try {
    // Check if driver exists
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const fine = await prisma.trafficFine.create({
      data: {
        driverId,
        amount: parseFloat(amount),
        issuedDate: new Date(issuedDate),
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: fine,
    });
  } catch (error) {
    console.error("Error recording traffic fine:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record traffic fine",
      error: error.message,
    });
  }
};

/**
 * @desc    Update traffic fine status
 * @route   PUT /api/fines/:id/status
 * @access  Private/Admin/Accountant
 */
export const updateFineStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { paid, deductedFromSalary } = req.body;

  try {
    const fine = await prisma.trafficFine.update({
      where: {
        id: req.params.id,
      },
      data: {
        paid,
        deductedFromSalary,
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: fine,
    });
  } catch (error) {
    console.error("Error updating fine status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update fine status",
      error: error.message,
    });
  }
};

/**
 * @desc    Get driver's traffic fines
 * @route   GET /api/fines/driver/:driverId
 * @access  Private/Admin/Accountant/Driver
 */
export const getDriverFines = async (req, res) => {
  try {
    const fines = await prisma.trafficFine.findMany({
      where: {
        driverId: req.params.driverId,
      },
      include: {
        driver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        issuedDate: "desc",
      },
    });

    // Calculate summary
    const summary = {
      totalFines: fines.length,
      totalAmount: fines.reduce((sum, fine) => sum + fine.amount, 0),
      paidFines: fines.filter((fine) => fine.paid).length,
      unpaidAmount: fines
        .filter((fine) => !fine.paid)
        .reduce((sum, fine) => sum + fine.amount, 0),
    };

    res.status(200).json({
      success: true,
      summary,
      data: fines,
    });
  } catch (error) {
    console.error("Error fetching traffic fines:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch traffic fines",
      error: error.message,
    });
  }
};

/**
 * @desc    Get advance payment and fine statistics
 * @route   GET /api/advances/stats
 * @access  Private/Admin/Accountant
 */
export const getAdvanceAndFineStats = async (req, res) => {
  try {
    // Get advance payment stats
    const advanceStats = await prisma.advancePayment.groupBy({
      by: ["status"],
      _count: true,
      _sum: {
        amount: true,
      },
    });

    // Get fine stats
    const fineStats = {
      total: await prisma.trafficFine.count(),
      paid: await prisma.trafficFine.count({
        where: { paid: true },
      }),
      totalAmount: await prisma.trafficFine.aggregate({
        _sum: {
          amount: true,
        },
      }),
      unpaidAmount: await prisma.trafficFine.aggregate({
        where: { paid: false },
        _sum: {
          amount: true,
        },
      }),
    };

    res.status(200).json({
      success: true,
      data: {
        advanceStats,
        fineStats,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
