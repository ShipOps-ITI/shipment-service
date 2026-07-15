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
  return prisma.shipment.create({
    data: {
      ...shipmentData,
      departureDate: new Date(shipmentData.departureDate),
      arrivalDate: new Date(shipmentData.arrivalDate),
    },
  });
};

export const updateShipment = async (id, shipmentData) => {
  await getShipmentById(id);

  return prisma.shipment.update({
    where: { id },
    data: {
      ...shipmentData,
      departureDate: new Date(shipmentData.departureDate),
      arrivalDate: new Date(shipmentData.arrivalDate),
    },
  });
};

export const patchShipment = async (id, shipmentData) => {
  const shipment = await findShipmentOrThrow(id);

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

export const deleteShipment = async (id) => {
  await getShipmentById(id);

  await prisma.shipment.delete({
    where: {
      id,
    },
  });

  return;
};