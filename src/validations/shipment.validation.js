import { body, query } from "express-validator";
import { SHIPMENT_STATUSES } from "../constants/shipmentStatus.js";

export const listShipmentValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),

  query("status")
    .optional()
    .isIn(SHIPMENT_STATUSES)
    .withMessage("Invalid shipment status."),

  query("origin")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Origin filter cannot exceed 100 characters."),

  query("destination")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Destination filter cannot exceed 100 characters."),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters."),
];

export const createShipmentValidation = [
  body("shipmentNumber")
    .notEmpty()
    .withMessage("Shipment number is required."),

  body("shipId")
    .isInt({ min: 1 })
    .withMessage("Ship ID must be a positive integer."),

  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required."),

  body("origin")
    .trim()
    .notEmpty()
    .withMessage("Origin is required."),

  body("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required."),

  body("departureDate")
    .isISO8601()
    .withMessage("Departure date must be a valid date."),

  body("arrivalDate")
    .isISO8601()
    .withMessage("Arrival date must be a valid date.")
    .custom((arrivalDate, { req }) => {
      const departureDate = new Date(req.body.departureDate);

      if (new Date(arrivalDate) < departureDate) {
        throw new Error(
          "Arrival date cannot be before departure date."
        );
      }

      return true;
    }),

body("status")
  .isIn(SHIPMENT_STATUSES)
  .withMessage("Invalid shipment status.")
];


export const updateShipmentValidation = [
  body("shipmentNumber")
    .trim()
    .notEmpty()
    .withMessage("Shipment number is required."),

  // body("shipId")
  // .not()
  // .exists()
  // .withMessage("ID must not be provided in the request body."),


  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required."),

  body("origin")
    .trim()
    .notEmpty()
    .withMessage("Origin is required."),

  body("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required."),

  body("departureDate")
    .isISO8601()
    .withMessage("Departure date must be a valid date."),

  body("arrivalDate")
    .isISO8601()
    .withMessage("Arrival date must be a valid date.")
    .custom((arrivalDate, { req }) => {
      const departureDate = new Date(req.body.departureDate);

      if (new Date(arrivalDate) < departureDate) {
        throw new Error("Arrival date cannot be before departure date.");
      }

      return true;
    }),

  body("status")
    .isIn(SHIPMENT_STATUSES)
    .withMessage("Invalid shipment status."),
];

export const patchShipmentValidation = [
  body("shipmentNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Shipment number cannot be empty."),


  body("customerName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Customer name cannot be empty."),

  body("origin")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Origin cannot be empty."),

  body("destination")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Destination cannot be empty."),

  body("departureDate")
    .optional()
    .isISO8601()
    .withMessage("Departure date must be a valid date."),

  body("arrivalDate")
    .optional()
    .isISO8601()
    .withMessage("Arrival date must be a valid date."),

  body("status")
    .optional()
    .isIn(SHIPMENT_STATUSES)
    .withMessage("Invalid shipment status."),
];