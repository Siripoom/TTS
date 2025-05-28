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
        departments: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: "asc",
          },
        },
        TruckQueue: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        InvoiceCustomerItem: {
          include: {
            InvoiceCustomer: {
              include: {
                product: true,
              },
            },
          },
        },
        _count: {
          select: {
            departments: {
              where: {
                isActive: true,
              },
            },
            TruckQueue: true,
            InvoiceCustomerItem: true,
          },
        },
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
        departments: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: "asc",
          },
        },
        TruckQueue: {
          include: {
            department: true,
            vehicle: true,
            driver: true,
            supplier: true,
          },
        },
        InvoiceCustomerItem: {
          include: {
            department: true,
            InvoiceCustomer: {
              include: {
                product: true,
              },
            },
          },
        },
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

  const { name, contactInfo, address } = req.body;

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        contactInfo,
        address,
      },
      include: {
        departments: true,
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
    const { name, contactInfo, address } = req.body;

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (contactInfo !== undefined) updateData.contactInfo = contactInfo;
    if (address !== undefined) updateData.address = address;

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      include: {
        departments: {
          where: {
            isActive: true,
          },
        },
      },
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
      include: {
        departments: true,
        TruckQueue: true,
        InvoiceCustomerItem: true,
      },
    });

    if (!customerExists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check if customer has associated records
    if (
      customerExists.TruckQueue.length > 0 ||
      customerExists.InvoiceCustomerItem.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete customer with associated records",
      });
    }

    // Delete customer (this will cascade delete departments)
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
 * @desc    Get customer departments
 * @route   GET /api/customers/:id/departments
 * @access  Private/Admin/Accountant
 */
export const getCustomerDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
        customerId: req.params.id,
        isActive: true,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            TruckQueue: true,
            InvoiceCustomerItem: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching customer departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer departments",
      error: error.message,
    });
  }
};

/**
 * @desc    Create customer department
 * @route   POST /api/customers/:id/departments
 * @access  Private/Admin/Accountant
 */
export const createCustomerDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, type, price, unit, contactInfo, address } = req.body;
  const customerId = req.params.id;

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

    // Check if department name already exists for this customer
    const existingDepartment = await prisma.department.findFirst({
      where: {
        customerId,
        name: {
          equals: name,
          mode: "insensitive",
        },
        isActive: true,
      },
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department with this name already exists for this customer",
      });
    }

    const department = await prisma.department.create({
      data: {
        customerId,
        name,
        type,
        price: parseFloat(price),
        unit,
        contactInfo,
        address,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create department",
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
    const invoices = await prisma.invoiceCustomerItem.findMany({
      where: {
        customerId: req.params.id,
      },
      include: {
        department: true,
        InvoiceCustomer: {
          include: {
            product: true,
          },
        },
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
        department: true,
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
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
