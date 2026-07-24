import { Router } from "express";

import * as cargoController from "../controllers/cargo.controller.js";

import {
  createCargoValidation,
  updateCargoValidation,
  patchCargoValidation,
  listCargoValidation,
} from "../validations/cargo.validation.js";

import validate from "../middleware/validate.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { Role } from "../constants/roles.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(
    Role.ADMIN,
    Role.FLEET_MANAGER,
    Role.PORT_OPERATOR,
    Role.CAPTAIN
  ),
  listCargoValidation,
  validate,
  cargoController.getAllCargo
);

router.get(
  "/:id",
  authenticate,
  authorize(
    Role.ADMIN,
    Role.FLEET_MANAGER,
    Role.PORT_OPERATOR,
    Role.CAPTAIN
  ),
  cargoController.getCargoById
);

router.post(
  "/",
  authenticate,
  authorize(
    Role.ADMIN,
    Role.FLEET_MANAGER
  ),
  createCargoValidation,
  validate,
  cargoController.createCargo
);

router.put(
  "/:id",
  authenticate,
  authorize(
    Role.ADMIN,
    Role.FLEET_MANAGER
  ),
  updateCargoValidation,
  validate,
  cargoController.replaceCargo
);

router.patch(
  "/:id",
  authenticate,
  authorize(
    Role.ADMIN,
    Role.FLEET_MANAGER,
    // Role.PORT_OPERATOR
  ),
  patchCargoValidation,
  validate,
  cargoController.patchCargo
);

router.delete(
  "/:id",
  authenticate,
  authorize(
    Role.ADMIN,
    Role.FLEET_MANAGER
  ),
  cargoController.deleteCargo
);

export default router;