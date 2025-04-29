import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany({
            include: {
                vehicle: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers,
        });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch drivers",
            error: error.message,
        });
    }
}

export const getDriverById = async (req, res) => {
    try {
        const driver = await prisma.driver.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                vehicle: true,
            },
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });
        }

        res.status(200).json({
            success: true,
            data: driver,
        });
    } catch (error) {
        console.error("Error fetching driver:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch driver",
            error: error.message,
        });
    }
}


export const createDriver = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, phone, address, birthDay, licenseNo, licenseExpire, licenseType, workStart, vehicleId } = req.body;

    try {

        const driverExists = await prisma.driver.findUnique({
            where: {
                licenseNo,
            },
        });

        if (driverExists) {
            return res.status(400).json({
                message: "Driver with this license number already exists",
            });
        }

        const driver = await prisma.driver.create({
            data: {
                name,
                licenseNo,
                licenseType,
                licenseExpire,
                phone,
                birthDay,
                address,
                workStart,
                vehicleId
            },
            include: {
                vehicle: true,
            },
        });

        res.status(201).json({
            success: true,
            data: driver,
        });
    } catch (error) {
        console.error("Error creating driver:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create driver",
            error: error.message,
        });
    }
}

export const updateDriver = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, phone, address, birthDay, licenseNo, licenseExpire, licenseType, workStart, vehicleId } = req.body;

    try {
        const driver = await prisma.driver.update({
            where: {
                id: req.params.id,
            },
            data: {
                name,
                phone,
                address,
                birthDay,
                licenseNo,
                licenseExpire,
                licenseType,
                workStart,
                vehicleId
            },
        });

        res.status(200).json({
            success: true,
            data: driver,
        });
    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update driver",
            error: error.message,
        });
    }
}

export const deleteDriver = async (req, res) => {
    try {
        const driver = await prisma.driver.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json({
            success: true,

            data: {},
        });
    } catch (error) {
        console.error("Error deleting driver:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete driver",
            error: error.message,
        });
    }
}