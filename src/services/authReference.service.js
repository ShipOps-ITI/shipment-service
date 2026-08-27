import AppError from "../utils/AppError.js";

const authBaseUrl = process.env.AUTH_SERVICE_URL || "http://localhost:5001/auth";

export const verifyCustomerAssignment = async (customerUserId, companyId, authorization) => {
  if (customerUserId === undefined || customerUserId === null || customerUserId === "") return;

  let response;
  try {
    response = await fetch(`${authBaseUrl}/users/${customerUserId}`, {
      headers: { Authorization: authorization },
    });
  } catch {
    throw new AppError("Auth Service is unavailable. Please try again shortly.", 503);
  }

  if (response.status === 404) throw new AppError("Selected customer was not found.", 400);
  if (response.status === 401 || response.status === 403) {
    throw new AppError("You cannot assign a customer outside this company.", 403);
  }
  if (!response.ok) throw new AppError("Could not validate the selected customer.", 502);

  const customer = await response.json();
  if (customer.role !== "CUSTOMER" || Number(customer.companyId) !== Number(companyId) || !customer.isActive) {
    throw new AppError("Select an active customer from this company.", 400);
  }
};
