import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private/Admin/Accountant
 */
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        Product: true,
        InvoiceSupplier: {
          include:{
            product:true,
            truckQueue:{
              include:{
                vehicle:true,
                driver:true
              }
            }
          }
        },
        _count: {
          select: {
            TruckQueue: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single supplier by ID
 * @route   GET /api/suppliers/:id
 * @access  Private/Admin/Accountant
 */
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        TruckQueue: true,
      },
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch supplier",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new supplier
 * @route   POST /api/suppliers
 * @access  Private/Admin/Accountant
 */
export const createSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, contactInfo, address } = req.body;

  try {
    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactInfo,
        address,
      },
    });

    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create supplier",
      error: error.message,
    });
  }
};

/**
 * @desc    Update supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private/Admin/Accountant
 */
export const updateSupplier = async (req, res) => {
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

    // Update supplier
    const updatedSupplier = await prisma.supplier.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedSupplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update supplier",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete supplier
 * @route   DELETE /api/suppliers/:id
 * @access  Private/Admin
 */
export const deleteSupplier = async (req, res) => {
  try {
    // Check if supplier exists first
    const supplierExists = await prisma.supplier.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!supplierExists) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    // Check if supplier is referenced by any truck queues
    const relatedTruckQueues = await prisma.truckQueue.findMany({
      where: {
        supplierId: req.params.id,
      },
    });

    if (relatedTruckQueues.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete supplier as it is referenced by truck queues",
        count: relatedTruckQueues.length,
      });
    }

    // Delete the supplier
    await prisma.supplier.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Supplier successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    // Handle foreign key constraint violations
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete supplier because it is referenced by other records",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete supplier",
      error: error.message,
    });
  }
};
