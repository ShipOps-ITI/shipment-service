import * as shipmentService from "../services/shipment.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllShipments = asyncHandler(async (req, res) => {
  const result = await shipmentService.getAllShipments(req.query);

  res.status(200).json({
    success: true,
    count: result.pagination.total,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.getShipmentById(
    Number(req.params.id)
  );

  res.status(200).json({
    success: true,
    data: shipment,
  });
});

export const createShipment = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.createShipment(req.body);

  res.status(201).json({
    success: true,
    message: "Shipment created successfully.",
    data: shipment,
  });
});

export const replaceShipment = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.replaceShipment(
    Number(req.params.id),
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Shipment updated successfully.",
    data: shipment,
  });
});

export const patchShipment = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.patchShipment(
    Number(req.params.id),
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Shipment updated successfully.",
    data: shipment,
  });
});

export const deleteShipment = asyncHandler(async (req, res) => {
  await shipmentService.deleteShipment(Number(req.params.id));

  res.status(200).json({
    success: true,
    message: "Shipment deleted successfully.",
  });
});