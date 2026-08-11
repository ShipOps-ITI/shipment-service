import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";



const findShipmentOrThrow = async (id, companyId = null) => {
  const shipment = await prisma.shipment.findFirst({
    where: { id, ...(companyId ? { companyId } : {}) },
  });

  if (!shipment) {
    throw new AppError("Shipment not found.", 404);
  }

  return shipment;
};

export const getAllShipments = async (filters = {}, companyId = null) => {
  const page = Number.isFinite(Number(filters.page)) && Number(filters.page) > 0
    ? Number(filters.page)
    : 1;
  const limit = Number.isFinite(Number(filters.limit)) && Number(filters.limit) > 0
    ? Math.min(Number(filters.limit), 100)
    : 10;
  const skip = (page - 1) * limit;

  const where = companyId ? { companyId } : {};

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

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.shipment.count({ where }),
  ]);

  return {
    data: shipments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDashboardStatistics = async (companyId = null) => {
  const where = companyId ? { companyId } : {};

  const [
    totalShipments,
    deliveredShipments,
    pendingShipments,
    shipmentsByStatus,
    latestShipments,
  ] = await Promise.all([
    prisma.shipment.count({ where }),
    prisma.shipment.count({ where: { ...where, status: "Delivered" } }),
    prisma.shipment.count({ where: { ...where, status: "Pending" } }),
    prisma.shipment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where,
    }),
    prisma.shipment.findMany({
      where,
      orderBy: {
        id: "desc",
      },
      take: 5,
      select: {
        id: true,
        shipId: true,
        customerName: true,
        status: true,
      },
    }),
  ]);

  return {
    totalShipments,
    deliveredShipments,
    pendingShipments,
    shipmentsByStatus: shipmentsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    latestShipments: latestShipments.map((shipment) => ({
      id: shipment.id,
      ship_id: shipment.shipId,
      customer: shipment.customerName,
      status: shipment.status,
    })),
  };
};

export const getShipmentById = async (id, companyId = null) => {
  const shipment = await prisma.shipment.findFirst({
    where: { id, ...(companyId ? { companyId } : {}) },
    include: {
      cargo: true,
    },
  });

  if (!shipment) {
    throw new AppError("Shipment not found.", 404);
  }

  return shipment;
};

export const createShipment = async (shipmentData) => {
  return prisma.shipment.create({
    data: {
      ...shipmentData,
      departureDate: new Date(shipmentData.departureDate),
      arrivalDate: new Date(shipmentData.arrivalDate),
    },
  });
};

export const replaceShipment = async (id, shipmentData) => {
  await findShipmentOrThrow(id, shipmentData.companyId);

  return prisma.shipment.update({
    where: { id },
    data: {
      ...shipmentData,
      departureDate: new Date(shipmentData.departureDate),
      arrivalDate: new Date(shipmentData.arrivalDate),
    },
  });
};


export const patchShipment = async (id, shipmentData, companyId = null) => {
  const shipment = await findShipmentOrThrow(id, companyId);

  if (shipment.status === "Delivered") {
    throw new AppError(
        "Delivered shipments cannot be modified.",
        400
    );
}

    const departureDate = new Date(
  shipmentData.departureDate ?? shipment.departureDate
);

    const arrivalDate = new Date(
    shipmentData.arrivalDate ?? shipment.arrivalDate
    );

    if (arrivalDate < departureDate) {
    throw new AppError(
        "Arrival date cannot be before departure date.",
        400
    );
    }

  if (
    shipment.status !== "Pending" &&
    shipmentData.shipmentNumber &&
    shipmentData.shipmentNumber !== shipment.shipmentNumber
)

{

    throw new AppError(
        "Shipment number cannot be changed after loading.",
        400
    );
}

  return prisma.shipment.update({
  where: { id },
  data: {
    ...shipmentData,

    ...(shipmentData.departureDate && {
      departureDate: new Date(shipmentData.departureDate),
    }),

    ...(shipmentData.arrivalDate && {
      arrivalDate: new Date(shipmentData.arrivalDate),
    }),
  },
});
};

export const deleteShipment = async (id, companyId = null) => {
  const shipment = await findShipmentOrThrow(id, companyId);

  await prisma.shipment.delete({
    where: {
      id,
    },
  });

  return;
};
