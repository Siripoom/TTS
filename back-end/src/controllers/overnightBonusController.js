import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Set overnight status for a truck queue
 * @route   PUT /api/overnight/:queueId
 * @access  Private/Admin/Accountant
 */
export const setOvernightStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { overnight, bonusAmount } = req.body;

  try {
    // Find queue and check if it exists
    const queue = await prisma.truckQueue.findUnique({
      where: { id: req.params.queueId },
      include: {
        driver: true,
        vehicle: true,
      },
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Truck queue not found",
      });
    }

    // Update queue overnight status
    const updatedQueue = await prisma.truckQueue.update({
      where: { id: req.params.queueId },
      data: { overnight },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
        vehicle: true,
      },
    });

    // If there's an existing driver payment, update the overnight bonus
    if (bonusAmount) {
      const existingPayment = await prisma.driverPayment.findFirst({
        where: { queueId: req.params.queueId },
      });

      if (existingPayment) {
        await prisma.driverPayment.update({
          where: { id: existingPayment.id },
          data: {
            overnightBonus: overnight ? parseFloat(bonusAmount) : 0,
            finalPayment:
              existingPayment.baseFare +
              (overnight ? parseFloat(bonusAmount) : 0) -
              existingPayment.deductions,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: updatedQueue,
    });
  } catch (error) {
    console.error("Error updating overnight status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update overnight status",
      error: error.message,
    });
  }
};

/**
 * @desc    Get overnight trip statistics
 * @route   GET /api/overnight/stats
 * @access  Private/Admin/Accountant
 */
export const getOvernightStats = async (req, res) => {
  try {
    // Get total overnight trips and bonus amounts
    const totalStats = await prisma.truckQueue.aggregate({
      where: {
        overnight: true,
      },
      _count: {
        _all: true,
      },
    });

    // Get overnight trips by driver
    const statsByDriver = await prisma.truckQueue.groupBy({
      by: ["driverId"],
      where: {
        overnight: true,
      },
      _count: {
        _all: true,
      },
      include: {
        driver: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get total overnight bonuses paid
    const bonusStats = await prisma.driverPayment.aggregate({
      where: {
        overnightBonus: {
          gt: 0,
        },
      },
      _sum: {
        overnightBonus: true,
      },
      _avg: {
        overnightBonus: true,
      },
    });

    // Get monthly overnight trip counts
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as trip_count,
        SUM(CASE WHEN p."overnightBonus" IS NOT NULL THEN p."overnightBonus" ELSE 0 END) as total_bonus
      FROM "TruckQueue" q
      LEFT JOIN "DriverPayment" p ON q.id = p."queueId"
      WHERE q.overnight = true
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    res.status(200).json({
      success: true,
      data: {
        totalOvernightTrips: totalStats._count._all,
        statsByDriver,
        totalBonusesPaid: bonusStats._sum.overnightBonus || 0,
        averageBonus: bonusStats._avg.overnightBonus || 0,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching overnight statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overnight statistics",
      error: error.message,
    });
  }
};

/**
 * @desc    Get driver's overnight trips
 * @route   GET /api/overnight/driver/:driverId
 * @access  Private/Admin/Accountant/Driver
 */
export const getDriverOvernightTrips = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Build date filter if dates are provided
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get driver's overnight trips
    const trips = await prisma.truckQueue.findMany({
      where: {
        driverId: req.params.driverId,
        overnight: true,
        ...dateFilter,
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        vehicle: {
          select: {
            plateNumber: true,
          },
        },
        DriverPayment: {
          select: {
            overnightBonus: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate summary
    const summary = {
      totalTrips: trips.length,
      totalBonus: trips.reduce((sum, trip) => {
        const bonus = trip.DriverPayment?.[0]?.overnightBonus || 0;
        return sum + bonus;
      }, 0),
    };

    res.status(200).json({
      success: true,
      summary,
      data: trips,
    });
  } catch (error) {
    console.error("Error fetching driver's overnight trips:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver's overnight trips",
      error: error.message,
    });
  }
};
