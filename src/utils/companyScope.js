import AppError from "./AppError.js";
import { Role } from "../constants/roles.js";
import { getAccessibleShipIds } from "../services/coreReference.service.js";

export const getCompanyIdForUser = (user) => {
  if (user.role === Role.ADMIN) return null;

  const companyId = Number(user.companyId);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    throw new AppError("Your account is not assigned to a company.", 403);
  }

  return companyId;
};

export const getShipmentScopeForUser = async (user, authorization) => {
  if (user.role === Role.ADMIN) return {};

  if (user.role === Role.CUSTOMER) {
    const customerUserId = Number(user.userId);
    if (!Number.isInteger(customerUserId) || customerUserId <= 0) {
      throw new AppError("Invalid customer account.", 403);
    }
    return { customerUserId };
  }

  if (user.role === Role.FLEET_MANAGER) {
    return { companyId: getCompanyIdForUser(user), shipId: { in: await getAccessibleShipIds(authorization) } };
  }

  return { companyId: getCompanyIdForUser(user) };
};

export const getCompanyIdForCreate = (user, requestedCompanyId) => {
  if (user.role !== Role.ADMIN) return getCompanyIdForUser(user);

  const companyId = Number(requestedCompanyId);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    throw new AppError("Admin must select a company for this shipment.", 400);
  }

  return companyId;
};
