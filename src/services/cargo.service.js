import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";
import { ensureCargoOwnerOrAdmin } from "../utils/cargoAuthorization.js";

const findCargoOrThrow = async (id) => {
  const cargo = await prisma.cargo.findUnique({
    where: { id },
  });

  if (!cargo) {
    throw new AppError("Cargo not found.", 404);
  }

  return cargo;
};

const validateCargoData = (cargoData) => {
  if (cargoData.weight !== undefined && Number(cargoData.weight) <= 0) {
    throw new AppError("Weight must be greater than zero.", 400);
  }

  if (cargoData.quantity !== undefined && cargoData.quantity <= 0) {
    throw new AppError("Quantity must be greater than zero.", 400);
  }
};

const validateStatusTransition = (currentStatus, newStatus) => {
  if (!newStatus || currentStatus === newStatus) return;

  const allowedTransitions = {
    Pending: ["Loaded"],
    Loaded: ["InTransit", "Damaged"],
    InTransit: ["Delivered", "Damaged"],
    Damaged: [],
    Delivered: [],
  };

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new AppError(
      `Invalid status transition from ${currentStatus} to ${newStatus}.`,
      400
    );
  }
};

export const getAllCargo = async (filters = {}) => {
  const page = Number.isFinite(Number(filters.page)) && Number(filters.page) > 0
    ? Number(filters.page)
    : 1;
  const limit = Number.isFinite(Number(filters.limit)) && Number(filters.limit) > 0
    ? Math.min(Number(filters.limit), 100)
    : 10;
  const skip = (page - 1) * limit;

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

  const [cargo, total] = await Promise.all([
    prisma.cargo.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        shipment: true,
      },
    }),
    prisma.cargo.count({ where }),
  ]);

  return {
    data: cargo,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCargoById = async (id) => {
  const cargo = await prisma.cargo.findUnique({
    where: { id },
    include: {
      shipment: true,
    },
  });

  if (!cargo) {
    throw new AppError("Cargo not found.", 404);
  }

  return cargo;
};

export const createCargo = async (cargoData, user) => {
  validateCargoData(cargoData);
  const shipment = await prisma.shipment.findUnique({
    where: {
        id: cargoData.shipmentId,
    },
});

if (!shipment) {
    throw new AppError(
        "Shipment not found.",
        404
    );
}

  return prisma.cargo.create({
    data: { ...cargoData, createdByUserId: user.userId },
  });
};

export const replaceCargo = async (id, cargoData, user) => {
  const cargo = await findCargoOrThrow(id);

  ensureCargoOwnerOrAdmin(cargo, user);

  if (cargo.status === "Delivered") {
    throw new AppError(
      "Delivered cargo cannot be modified.",
      400
    );
  }

  validateCargoData(cargoData);

  validateStatusTransition(
    cargo.status,
    cargoData.status
  );

  if (
    cargo.status !== "Pending" &&
    cargoData.containerNumber &&
    cargo.containerNumber !== cargoData.containerNumber
  ) {
    throw new AppError(
      "Container number cannot be changed after cargo is loaded.",
      400
    );
  }

  return prisma.cargo.update({
    where: { id },
    data: cargoData,
  });
};

export const patchCargo = async (id, cargoData, user) => {
  const cargo = await findCargoOrThrow(id);

  ensureCargoOwnerOrAdmin(cargo, user);

  if (cargo.status === "Delivered") {
    throw new AppError(
      "Delivered cargo cannot be modified.",
      400
    );
  }

  validateCargoData(cargoData);

  validateStatusTransition(
    cargo.status,
    cargoData.status
  );

  if (
    cargo.status !== "Pending" &&
    cargoData.containerNumber &&
    cargo.containerNumber !== cargoData.containerNumber
  ) {
    throw new AppError(
      "Container number cannot be changed after cargo is loaded.",
      400
    );
  }

  return prisma.cargo.update({
    where: { id },
    data: cargoData,
  });
};

export const deleteCargo = async (id, user) => {
  const cargo = await findCargoOrThrow(id);

  ensureCargoOwnerOrAdmin(cargo, user);

  if (cargo.status === "Delivered") {
    throw new AppError(
      "Delivered cargo cannot be deleted.",
      400
    );
  }

  await prisma.cargo.delete({
    where: { id },
  });

  return;
};