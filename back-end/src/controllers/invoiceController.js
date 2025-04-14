import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all invoices
 * @route   GET /api/invoices
 * @access  Private/Admin/Accountant
 */
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            contactInfo: true,
          },
        },
        InvoiceItem: {
          include: {
            truckQueue: {
              select: {
                id: true,
                distanceKm: true,
                tripType: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

/**
 * @desc    Get invoice by ID
 * @route   GET /api/invoices/:id
 * @access  Private/Admin/Accountant
 */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            contactInfo: true,
            address: true,
          },
        },
        InvoiceItem: {
          include: {
            truckQueue: {
              include: {
                vehicle: true,
                driver: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                supplier: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new invoice
 * @route   POST /api/invoices
 * @access  Private/Admin/Accountant
 */
export const createInvoice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { customerId, dueDate, items } = req.body;

  try {
    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validate all queue IDs exist and belong to the customer
    for (const item of items) {
      const queue = await prisma.truckQueue.findFirst({
        where: {
          id: item.queueId,
          customerId: customerId,
          status: "completed",
        },
      });

      if (!queue) {
        return res.status(400).json({
          success: false,
          message: `Invalid or incomplete queue ID: ${item.queueId}`,
        });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );

    // Create invoice with items in a transaction
    const invoice = await prisma.$transaction(async (prisma) => {
      // Create invoice
      const newInvoice = await prisma.invoice.create({
        data: {
          customerId,
          totalAmount,
          dueDate: new Date(dueDate),
          status: "unpaid",
          InvoiceItem: {
            create: items.map((item) => ({
              queueId: item.queueId,
              amount: parseFloat(item.amount),
            })),
          },
        },
        include: {
          customer: true,
          InvoiceItem: {
            include: {
              truckQueue: true,
            },
          },
        },
      });

      return newInvoice;
    });

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

/**
 * @desc    Update invoice status
 * @route   PATCH /api/invoices/:id/status
 * @access  Private/Admin/Accountant
 */
export const updateInvoiceStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: req.params.id,
      },
      data: {
        status,
      },
      include: {
        customer: true,
        InvoiceItem: {
          include: {
            truckQueue: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update invoice status",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete invoice
 * @route   DELETE /api/invoices/:id
 * @access  Private/Admin
 */
export const deleteInvoice = async (req, res) => {
  try {
    // Check if invoice exists and is unpaid
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        InvoiceItem: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.status !== "unpaid") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete paid or overdue invoice",
      });
    }

    // Delete invoice and its items in a transaction
    await prisma.$transaction([
      prisma.invoiceItem.deleteMany({
        where: { invoiceId: req.params.id },
      }),
      prisma.invoice.delete({
        where: { id: req.params.id },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Invoice successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
      error: error.message,
    });
  }
};

/**
 * @desc    Get billing statistics
 * @route   GET /api/invoices/stats
 * @access  Private/Admin/Accountant
 */
export const getBillingStats = async (req, res) => {
  try {
    // Get total amount and count by status
    const statsByStatus = await prisma.invoice.groupBy({
      by: ["status"],
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    // Get total amount by customer
    const statsByCustomer = await prisma.invoice.groupBy({
      by: ["customerId"],
      _sum: {
        totalAmount: true,
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get monthly billing totals
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM("totalAmount") as total_amount,
        COUNT(*) as invoice_count
      FROM "Invoice"
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    // Get overdue invoices
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: "overdue",
      },
      include: {
        customer: {
          select: {
            name: true,
            contactInfo: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: {
        statsByStatus,
        statsByCustomer,
        monthlyStats,
        overdueInvoices,
      },
    });
  } catch (error) {
    console.error("Error fetching billing statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch billing statistics",
      error: error.message,
    });
  }
};
