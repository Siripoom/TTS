import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getInvoiceSupplier = async (req, res) => {
    try {
        const invoiceSupplier = await prisma.invoiceSupplier.findMany({
            include: {
                truckQueue: {
                    include: {
                        vehicle: true,
                        driver: true
                    }
                },
                supplier: true,
                product: true,
            },
        });
        res.status(200).json({
            success: true,
            data: invoiceSupplier,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const createInvoiceSupplier = async (req, res) => {
    try {
        const { supplierId, productId, cost, truckQueueId, dueDate, dateIn, dateOut, weightIn, weightOut } = req.body;

        const totalAmount = cost * (weightOut - weightIn);

        const newInvoiceSupplier = await prisma.invoiceSupplier.create({
            data: {
                supplierId,
                productId,
                cost,
                truckQueueId,
                dateIn,
                dateOut,
                weightIn,
                weightOut,
                totalAmount,
                dueDate,
            },
        });

        if (!newInvoiceSupplier) {
            return res.status(400).json({
                success: false,
                message: "Failed to create invoice supplier",
            });
        }

        res.status(201).json({
            success: true,
            message: "create Data success",
            data: newInvoiceSupplier
        })

    } catch (error) {
        console.error("Error creating invoice supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create invoice supplier",
            error: error.message,
        });
    }
}

export const updateInvoiceSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { supplierId, productId, cost, truckQueueId, dueDate, dateIn, dateOut, weightIn, weightOut } = req.body;

        const totalAmount = cost * (weightIn - weightOut);

        const updatedInvoiceSupplier = await prisma.invoiceSupplier.update({
            where: {
                id: id,
            },
            data: {
                supplierId,
                productId,
                cost,
                truckQueueId,
                dateIn,
                dateOut,
                weightIn,
                weightOut,
                totalAmount,
                dueDate,
            },
        });

        if (!updatedInvoiceSupplier) {
            return res.status(400).json({
                success: false,
                message: "Failed to update invoice supplier",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedInvoiceSupplier,
        });
    } catch (error) {
        console.error("Error updating invoice supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update invoice supplier",
            error: error.message,
        });
    }
}

export const deleteInvoiceSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInvoiceSupplier = await prisma.invoiceSupplier.delete({
            where: {
                id: id,
            },
        });

        if (!deletedInvoiceSupplier) {
            return res.status(400).json({
                success: false,
                message: "Failed to delete invoice supplier",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedInvoiceSupplier,
        });
    } catch (error) {
        console.error("Error deleting invoice supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete invoice supplier",
            error: error.message,
        });
    }
}

export const getInvoiceSupplierById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoiceSupplier = await prisma.invoiceSupplier.findUnique({
            where: {
                id: id,
            },
            include: {
                InvoiceSupplierItem: {
                    include: {
                        supplier: true
                    }
                },
                supplier: true
            },
        });

        if (!invoiceSupplier) {
            return res.status(404).json({
                success: false,
                message: "Invoice supplier not found",
            });
        }

        res.status(200).json({
            success: true,
            data: invoiceSupplier,
        });
    } catch (error) {
        console.error("Error fetching invoice supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch invoice supplier",
            error: error.message,
        });
    }
}