import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
const prisma = new PrismaClient();

export const getInvoiceCustomerItem = async (req, res) => {
    try {
        const invoiceCustomerItem = await prisma.invoiceCustomerItem.findMany({
            include: {
                InvoiceCustomer: {
                    include: {
                        product: true
                    }
                },
                customer: true
            },
        });
        res.status(200).json({
            success: true,
            data: invoiceCustomerItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const getInvoiceCustomerItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoiceCustomerItem = await prisma.invoiceCustomerItem.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                InvoiceCustomer: {
                    include: {
                        product: true
                    }
                },
                customer: true
            },
        });

        if (!invoiceCustomerItem) {
            return res.status(404).json({
                success: false,
                message: "Invoice customer item not found",
            });
        }

        res.status(200).json({
            success: true,
            data: invoiceCustomerItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const createInvoiceCustomerItem = async (req, res) => {
    try {

        const { customerId, dueDate, InvoiceCustomer } = req.body;

        const totalAmount = InvoiceCustomer.reduce((acc, item) => {
            const { quantity, price } = item;
            return acc + (quantity * price);
        }, 0);
        
        const newInvoiceCustomerItem = await prisma.invoiceCustomerItem.create({
            data: {
                customerId,
                totalAmount,
                dueDate,
            },
        });

        if (!newInvoiceCustomerItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to create invoice customer item",
            });
        }
        // Create InvoiceCustomer
        InvoiceCustomer.map(async (item) => {
            const { productId, quantity, weight, price } = item;
            const amount = quantity * price;
            await prisma.invoiceCustomer.create({
                data: {
                    productId,
                    quantity,
                    weight,
                    price,
                    amount,
                    invoiceId: newInvoiceCustomerItem.id,
                },
            });
            if (!newInvoiceCustomerItem) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create invoice customer item",
                });
            }
        });

        res.status(201).json({
            success: true,
            data: newInvoiceCustomerItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });

    }
}

export const updateInvoiceCustomerItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerId, totalAmount, dueDate, InvoiceCustomer } = req.body;

        const updatedInvoiceCustomerItem = await prisma.invoiceCustomerItem.update({
            where: {
                id: parseInt(id),
            },
            data: {
                customerId,
                totalAmount,
                dueDate,
            },
        });

        if (!updatedInvoiceCustomerItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to update invoice customer item",
            });
        }
        // Create InvoiceCustomer
        InvoiceCustomer.map(async (item) => {
            const { productId, quantity, weight, price } = item;
            const amount = quantity * price;
            const newInvoiceCustomerItem = await prisma.invoiceCustomerItem.create({
                data: {
                    productId,
                    quantity,
                    weight,
                    price,
                    amount,
                    invoiceCustomerItemId: updatedInvoiceCustomerItem.id,
                },
            });
            if (!newInvoiceCustomerItem) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create invoice customer item",
                });
            }
        });

        

        res.status(201).json({
            success: true,
            data: updatedInvoiceCustomerItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });

    }
}

export const deleteInvoiceCustomerItem = async (req, res) => {
    try {
        const { id } = req.params;

        // ลบข้อมูลใน InvoiceCustomer ก่อน
        await prisma.invoiceCustomer.deleteMany({
            where: {
                invoiceId: id, // ใช้ id ของ InvoiceCustomerItem
            },
        });

        // ลบข้อมูลใน InvoiceCustomerItem
        const deletedInvoiceCustomerItem = await prisma.invoiceCustomerItem.delete({
            where: {
                id: id,
            },
        });

        if (!deletedInvoiceCustomerItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to delete invoice customer item",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedInvoiceCustomerItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
