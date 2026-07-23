import { body, param } from "express-validator";

const cargoStatuses = [
    "Pending",
    "Loaded",
    "InTransit",
    "Delivered",
    "Damaged",
];

export const createCargoValidation = [

    body("shipmentId")
        .isInt({ min: 1 })
        .withMessage("Shipment ID must be a positive integer."),

    body("cargoName")
        .trim()
        .notEmpty()
        .withMessage("Cargo name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Cargo name must be between 2 and 100 characters."),

    body("createdByUserId")
        .isInt({ min: 1 })
        .withMessage("Creator ID must be a positive integer."),
    body("cargoType")
        .trim()
        .notEmpty()
        .withMessage("Cargo type is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Cargo type must be between 2 and 50 characters."),

    body("weight")
        .isFloat({ gt: 0 })
        .withMessage("Weight must be greater than zero."),

    body("quantity")
        .isInt({ gt: 0 })
        .withMessage("Quantity must be greater than zero."),

    body("containerNumber")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Container number cannot exceed 50 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("status")
        .optional()
        .isIn(cargoStatuses)
        .withMessage("Invalid cargo status."),
];

export const updateCargoValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid cargo ID."),

    body("shipmentId")
        .isInt({ min: 1 })
        .withMessage("Shipment ID must be a positive integer."),

    body("createdByUserId")
        .isInt({ min: 1 })
        .withMessage("Creator ID must be a positive integer."),

    body("cargoName")
        .trim()
        .notEmpty()
        .withMessage("Cargo name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Cargo name must be between 2 and 100 characters."),

    body("cargoType")
        .trim()
        .notEmpty()
        .withMessage("Cargo type is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Cargo type must be between 2 and 50 characters."),

    body("weight")
        .isFloat({ gt: 0 })
        .withMessage("Weight must be greater than zero."),

    body("quantity")
        .isInt({ gt: 0 })
        .withMessage("Quantity must be greater than zero."),

    body("containerNumber")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Container number cannot exceed 50 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("status")
        .isIn(cargoStatuses)
        .withMessage("Invalid cargo status."),
];

export const patchCargoValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid cargo ID."),

    body("shipmentId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Shipment ID must be a positive integer."),

    body("createdByUserId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Creator ID must be a positive integer."),
    body("cargoName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Cargo name must be between 2 and 100 characters."),

    body("cargoType")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Cargo type must be between 2 and 50 characters."),

    body("weight")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Weight must be greater than zero."),

    body("quantity")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Quantity must be greater than zero."),

    body("containerNumber")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Container number cannot exceed 50 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("status")
        .optional()
        .isIn(cargoStatuses)
        .withMessage("Invalid cargo status."),
];