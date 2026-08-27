import AppError from "../utils/AppError.js";

const coreBaseUrl = process.env.CORE_SERVICE_URL || "http://localhost:5002/api/v1";

const getCoreRecord = async (path, authorization, label) => {
  let response;
  try {
    response = await fetch(`${coreBaseUrl}${path}`, {
      headers: { Authorization: authorization },
    });
  } catch {
    throw new AppError("Core Service is unavailable. Please try again shortly.", 503);
  }

  if (response.status === 404) throw new AppError(`${label} not found.`, 400);
  if (response.status === 401 || response.status === 403) {
    throw new AppError(`You do not have access to the selected ${label.toLowerCase()}.`, 403);
  }
  if (!response.ok) throw new AppError(`Could not validate the selected ${label.toLowerCase()}.`, 502);

  const payload = await response.json();
  return payload.data;
};

export const verifyShipmentReferences = async ({ shipId, originPortId, destinationPortId, companyId, authorization }) => {
  if (Number(originPortId) === Number(destinationPortId)) {
    throw new AppError("Origin and destination ports must be different.", 400);
  }

  const [ship, originPort, destinationPort] = await Promise.all([
    getCoreRecord(`/ships/${shipId}`, authorization, "Ship"),
    getCoreRecord(`/ports/${originPortId}`, authorization, "Origin port"),
    getCoreRecord(`/ports/${destinationPortId}`, authorization, "Destination port"),
  ]);

  if (ship.companyId !== Number(companyId)) {
    throw new AppError("The selected ship does not belong to this company.", 400);
  }

  return { ship, originPort, destinationPort };
};

export const getAccessibleShipIds = async (authorization) => {
  let response;
  try {
    response = await fetch(`${coreBaseUrl}/ships?page=1&limit=100`, {
      headers: { Authorization: authorization },
    });
  } catch {
    throw new AppError("Core Service is unavailable. Please try again shortly.", 503);
  }

  if (response.status === 401 || response.status === 403) {
    throw new AppError("You do not have access to ships in this company.", 403);
  }
  if (!response.ok) throw new AppError("Could not determine accessible ships.", 502);

  const payload = await response.json();
  return (payload.data ?? []).map((ship) => Number(ship.id)).filter(Number.isInteger);
};
