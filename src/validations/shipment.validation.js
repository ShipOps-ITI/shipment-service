import { body } from "express-validator";

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
    .isIn([
      "Pending",
      "Loaded",
      "In Transit",
      "Delivered",
      "Delayed",
      "Cancelled",
    ])
    .withMessage("Invalid shipment status."),
];