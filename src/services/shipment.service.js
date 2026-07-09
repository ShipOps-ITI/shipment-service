import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

export const getAllShipments = async () => {
  return await prisma.shipment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getShipmentById = async (id) => {
  const shipment = await prisma.shipment.findUnique({
    where: {
      id,
    },
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
  return await prisma.shipment.create({
    data: shipmentData,
  });
};

export const updateShipment = async (id, shipmentData) => {
  await getShipmentById(id);

  return await prisma.shipment.update({
    where: {
      id,
    },
    data: shipmentData,
  });
};

export const deleteShipment = async (id) => {
  await getShipmentById(id);

  await prisma.shipment.delete({
    where: {
      id,
    },
  });

  return;
};