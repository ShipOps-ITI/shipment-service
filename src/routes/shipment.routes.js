import { Router } from "express";

import * as shipmentController from "../controllers/shipment.controller.js";
import {
  createShipmentValidation,
  updateShipmentValidation,
  patchShipmentValidation,
  listShipmentValidation,
} from "../validations/shipment.validation.js";
import validate from "../middleware/validate.js";
import authenticate from "../middleware/authenticate.js";
import { Role } from "../constants/roles.js";
import authorize from "../middleware/authorize.js";

const router = Router();
const operationsRoles = [Role.ADMIN, Role.COMPANY_ADMIN, Role.FLEET_MANAGER];
const readRoles = [...operationsRoles, Role.CUSTOMER];

router.get("/", authenticate, authorize(...readRoles), listShipmentValidation, validate, shipmentController.getAllShipments);
router.get("/dashboard/statistics", authenticate, authorize(...readRoles), shipmentController.getDashboardStatistics);
router.get("/:id", authenticate, authorize(...readRoles), shipmentController.getShipmentById);
router.post("/", authenticate, authorize(...operationsRoles), createShipmentValidation, validate, shipmentController.createShipment);
router.put("/:id", authenticate, authorize(...operationsRoles), updateShipmentValidation, validate, shipmentController.replaceShipment);
router.patch("/:id", authenticate, authorize(...operationsRoles), patchShipmentValidation, validate, shipmentController.patchShipment);
router.delete("/:id", authenticate, authorize(...operationsRoles), shipmentController.deleteShipment);

export default router;
