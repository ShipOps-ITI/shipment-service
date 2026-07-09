import { Router } from "express";

import * as shipmentController from "../controllers/shipment.controller.js";
import { createShipmentValidation } from "../validations/shipment.validation.js";
import validate from "../middleware/validate.js";
;

const router = Router();

router.get("/", shipmentController.getAllShipments);

router.get("/:id", shipmentController.getShipmentById);

router.post(
  "/",
  createShipmentValidation,
  validate,
  shipmentController.createShipment
);

router.put("/:id", shipmentController.updateShipment);

router.delete("/:id", shipmentController.deleteShipment);

export default router;
