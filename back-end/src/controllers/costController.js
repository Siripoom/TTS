import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();


/** 
    @desc   Get all costs
    @route  GET /api/costs
    @access Private/Admin
**/
export const getCosts = async (req, res) => {
    try {
        // Get all costs
        const costs = await prisma.cost.findMany({
            include: {
                Driver: true,
                Vehicle: true,
            },
        });

        res.status(200).json({
            success: true,
            data: costs,
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}
/**
    @desc   Get a cost by ID
    @route  GET /api/costs/:id
    @access Private/Admin
 **/

export const getCostById = async (req, res) => {
    const { id } = req.params;

    try {
        // Get a cost by ID
        const cost = await prisma.cost.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                driver: true,
                vehicle: true,
            },
        });

        if (!cost) {
            return res.status(404).json({
                success: false,
                message: "Cost not found",
            });
        }

        res.status(200).json({
            success: true,
            data: cost,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}


/**
 * @desc    Create a new cost
 * @route   POST /api/costs
 * @access  Private/Admin
 */
export const createCost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { driverId, vehicleId, costType, billNo, description, amount, paymentBy, date } = req.body;

    try {
        // Create a new cost
        const cost = await prisma.cost.create({
            data: {
                driverId: driverId,
                vehicleId: vehicleId,
                costType: costType,
                billNo: billNo,
                description: description,
                amount,
                paymentBy,
                status: "pending", // Set default status to "Pending"
                date: new Date(date), // Convert to Date object
            },
        });

        res.status(201).json({
            success: true,
            data: cost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

/**
 * @desc    Update a cost
 * @route   PUT /api/costs/:id
 * @access  Private/Admin
 */

export const updateCost = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { driverId, vehicleId, costType, billNo, description, amount, paymentBy, date } = req.body;

    try {
        // Update a cost
        const cost = await prisma.cost.update({
            where: {
                id: id,
            },
            data: {
                driverId: driverId,
                vehicleId: vehicleId,
                costType: costType,
                billNo: billNo,
                description: description,
                amount,
                paymentBy: paymentBy,
                status: "pending", // Set default status to "Pending"
                date: new Date(date), // Convert to Date object
            },
        });

        res.status(200).json({
            success: true,
            data: cost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}


/**
 * @desc    Delete a cost
 * @route   DELETE /api/costs/:id
 * @access  Private/Admin
 */

export const deleteCost = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete a cost
        const cost = await prisma.cost.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Cost deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}
