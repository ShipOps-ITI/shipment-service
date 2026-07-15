import { Router } from "express";

import * as shipmentController from "../controllers/shipment.controller.js";

const router = Router();

router.get("/", shipmentController.getAllShipments);

router.get("/:id", shipmentController.getShipmentById);

router.post("/", shipmentController.createShipment);

router.put("/:id", shipmentController.updateShipment);

router.patch(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.FLEET_MANAGER,
        Role.PORT_OPERATOR
    ),
    patchShipmentValidation,
    validate,
    shipmentController.patchShipment
);
router.delete("/:id",
    authenticate,
    authorize(
        Role.ADMIN
    ),
    shipmentController.deleteShipment);

export default router;