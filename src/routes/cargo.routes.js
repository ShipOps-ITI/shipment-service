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
const operationsRoles = [Role.ADMIN, Role.COMPANY_ADMIN, Role.FLEET_MANAGER];

router.get("/", authenticate, authorize(...operationsRoles), listCargoValidation, validate, cargoController.getAllCargo);
router.get("/:id", authenticate, authorize(...operationsRoles), cargoController.getCargoById);
router.post("/", authenticate, authorize(...operationsRoles), createCargoValidation, validate, cargoController.createCargo);
router.put("/:id", authenticate, authorize(...operationsRoles), updateCargoValidation, validate, cargoController.replaceCargo);
router.patch("/:id", authenticate, authorize(...operationsRoles), patchCargoValidation, validate, cargoController.patchCargo);
router.delete("/:id", authenticate, authorize(...operationsRoles), cargoController.deleteCargo);

export default router;
