import AppError from "./AppError.js";
import { Role } from "../constants/roles.js";

export const getCompanyIdForUser = (user) => {
  if (user.role === Role.ADMIN) return null;

  const companyId = Number(user.companyId);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    throw new AppError("Your account is not assigned to a company.", 403);
  }

  return companyId;
};

export const getCompanyIdForCreate = (user, requestedCompanyId) => {
  if (user.role !== Role.ADMIN) return getCompanyIdForUser(user);

  const companyId = Number(requestedCompanyId);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    throw new AppError("Admin must select a company for this shipment.", 400);
  }

  return companyId;
};
