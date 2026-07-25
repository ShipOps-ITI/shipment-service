export const buildPagination = (filters = {}, defaultLimit = 10, maxLimit = 100) => {
  const page = Number.isFinite(Number(filters.page)) && Number(filters.page) > 0
    ? Number(filters.page)
    : 1;
  const limit = Number.isFinite(Number(filters.limit)) && Number(filters.limit) > 0
    ? Math.min(Number(filters.limit), maxLimit)
    : defaultLimit;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const buildShipmentFilterWhere = (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.origin?.trim()) {
    where.origin = { contains: filters.origin.trim(), mode: "insensitive" };
  }

  if (filters.destination?.trim()) {
    where.destination = { contains: filters.destination.trim(), mode: "insensitive" };
  }

  if (filters.search?.trim()) {
    const searchValue = filters.search.trim();
    where.OR = [
      { shipmentNumber: { contains: searchValue, mode: "insensitive" } },
      { customerName: { contains: searchValue, mode: "insensitive" } },
      { origin: { contains: searchValue, mode: "insensitive" } },
      { destination: { contains: searchValue, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCargoFilterWhere = (filters = {}) => {
  const where = {};

  if (filters.shipmentId) {
    where.shipmentId = Number(filters.shipmentId);
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search?.trim()) {
    const searchValue = filters.search.trim();
    where.OR = [
      { cargoName: { contains: searchValue, mode: "insensitive" } },
      { cargoType: { contains: searchValue, mode: "insensitive" } },
      { containerNumber: { contains: searchValue, mode: "insensitive" } },
      { description: { contains: searchValue, mode: "insensitive" } },
    ];
  }

  return where;
};
