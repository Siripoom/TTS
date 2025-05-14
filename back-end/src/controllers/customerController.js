import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private/Admin/Accountant
 */
export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        TruckQueue: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        InvoiceCustomerItem: {
          include:{
            InvoiceCustomer:{
              include:{
                product:true
              }
            }
            
          }
        }
      },
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single customer by ID
 * @route   GET /api/customers/:id
 * @access  Private/Admin/Accountant
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        TruckQueue: true,
        InvoiceCustomerItem: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Private/Admin/Accountant
 */
export const createCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, contactInfo, address, pricePerTrip } = req.body;

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        contactInfo,
        address,
        pricePerTrip: parseFloat(pricePerTrip),
      },
    });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private/Admin/Accountant
 */
export const updateCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, contactInfo, address, pricePerTrip } = req.body;

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (contactInfo !== undefined) updateData.contactInfo = contactInfo;
    if (address !== undefined) updateData.address = address;
    if (pricePerTrip !== undefined)
      updateData.pricePerTrip = parseFloat(pricePerTrip);

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private/Admin
 */
export const deleteCustomer = async (req, res) => {
  try {
    // Check if customer exists first
    const customerExists = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!customerExists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Delete the customer
    await prisma.customer.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Customer successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Handle foreign key constraint violations
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete customer because it is referenced by other records",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};

/**
 * @desc    Get customer invoice history
 * @route   GET /api/customers/:id/invoices
 * @access  Private/Admin/Accountant
 */
export const getCustomerInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        customerId: req.params.id,
      },
      include: {
        InvoiceItem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!invoices.length) {
      return res.status(200).json({
        success: true,
        message: "No invoices found for this customer",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("Error fetching customer invoices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer invoices",
      error: error.message,
    });
  }
};

/**
 * @desc    Get customer truck queue history
 * @route   GET /api/customers/:id/queues
 * @access  Private/Admin/Accountant
 */
export const getCustomerQueues = async (req, res) => {
  try {
    const queues = await prisma.truckQueue.findMany({
      where: {
        customerId: req.params.id,
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

    if (!queues.length) {
      return res.status(200).json({
        success: true,
        message: "No truck queues found for this customer",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: queues.length,
      data: queues,
    });
  } catch (error) {
    console.error("Error fetching customer truck queues:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer truck queues",
      error: error.message,
    });
  }
};
