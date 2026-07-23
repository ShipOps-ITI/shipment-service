import AppError from "./AppError.js";
import { Role } from "../constants/roles.js";

export const ensureCargoOwnerOrAdmin = (cargo, user) => {

    if (user.role === Role.ADMIN) {
        return;
    }

    if (cargo.createdByUserId !== user.userId) {

        throw new AppError(
            "You are not allowed to modify this cargo.",
            403
        );

    }

};