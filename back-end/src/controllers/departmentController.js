import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all departments by customer ID
 * @route   GET /api/customers/:customerId/departments
 * @access  Private/Admin/Accountant
 */
export const getDepartmentsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const departments = await prisma.department.findMany({
      where: {
        customerId,
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
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

/**
 * @desc    Get department by ID
 * @route   GET /api/departments/:id
 * @access  Private/Admin/Accountant
 */
export const getDepartmentById = async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        customer: true,
        TruckQueue: {
          include: {
            vehicle: true,
            driver: true,
            supplier: true,
          },
        },
        InvoiceCustomerItem: true,
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new department
 * @route   POST /api/customers/:customerId/departments
 * @access  Private/Admin/Accountant
 */
export const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { customerId } = req.params;
  const { name, type, price, unit, contactInfo, address } = req.body;

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
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private/Admin/Accountant
 */
export const updateDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, type, price, unit, contactInfo, address, isActive } =
      req.body;

    // Check if department exists
    const departmentExists = await prisma.department.findUnique({
      where: { id: req.params.id },
    });

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // If name is being changed, check it's not already in use for this customer
    if (name && name !== departmentExists.name) {
      const nameExists = await prisma.department.findFirst({
        where: {
          customerId: departmentExists.customerId,
          name: {
            equals: name,
            mode: "insensitive",
          },
          isActive: true,
          NOT: {
            id: req.params.id,
          },
        },
      });

      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: "Department with this name already exists for this customer",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (unit !== undefined) updateData.unit = unit;
    if (contactInfo !== undefined) updateData.contactInfo = contactInfo;
    if (address !== undefined) updateData.address = address;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedDepartment = await prisma.department.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update department",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete department (soft delete)
 * @route   DELETE /api/departments/:id
 * @access  Private/Admin
 */
export const deleteDepartment = async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: req.params.id },
      include: {
        TruckQueue: true,
        InvoiceCustomerItem: true,
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Check if department has associated records
    if (
      department.TruckQueue.length > 0 ||
      department.InvoiceCustomerItem.length > 0
    ) {
      // Soft delete - set isActive to false
      await prisma.department.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });

      return res.status(200).json({
        success: true,
        message: "Department deactivated successfully (has associated records)",
      });
    }

    // Hard delete if no associated records
    await prisma.department.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Department successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete department",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private/Admin/Accountant
 */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
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
      orderBy: [
        {
          customer: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching all departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};
