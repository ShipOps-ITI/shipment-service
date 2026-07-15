import { Router } from "express";

import * as shipmentController from "../controllers/shipment.controller.js";
import { createShipmentValidation, updateShipmentValidation, patchShipmentValidation } from "../validations/shipment.validation.js";
import validate from "../middleware/validate.js";
import authenticate from "../middleware/authenticate.js";
import { Role } from "../constants/roles.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.get("/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.FLEET_MANAGER,
        Role.PORT_OPERATOR,
        Role.CAPTAIN
    ),
    shipmentController.getAllShipments);

router.get("/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.FLEET_MANAGER,
        Role.PORT_OPERATOR,
        Role.CAPTAIN
    ),
    shipmentController.getShipmentById);

router.post(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.FLEET_MANAGER
    ),
    createShipmentValidation,
    validate,
    shipmentController.createShipment
);

router.put(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.FLEET_MANAGER
    ),
    updateShipmentValidation,
    validate,
    shipmentController.replaceShipment
);

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
