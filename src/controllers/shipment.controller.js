import * as shipmentService from "../services/shipment.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { getCompanyIdForCreate, getCompanyIdForUser, getShipmentScopeForUser } from "../utils/companyScope.js";
import { verifyShipmentReferences } from "../services/coreReference.service.js";

export const getAllShipments = asyncHandler(async (req, res) => {
  const result = await shipmentService.getAllShipments(req.query, getShipmentScopeForUser(req.user));

  res.status(200).json({
    success: true,
    count: result.pagination.total,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.getShipmentById(Number(req.params.id), getShipmentScopeForUser(req.user));

  res.status(200).json({
    success: true,
    data: shipment,
  });
});

export const getDashboardStatistics = asyncHandler(async (req, res) => {
  const statistics = await shipmentService.getDashboardStatistics(getShipmentScopeForUser(req.user));

  res.status(200).json(statistics);
});

export const createShipment = asyncHandler(async (req, res) => {
  const companyId = getCompanyIdForCreate(req.user, req.body.companyId);
  const references = await verifyShipmentReferences({
    ...req.body,
    companyId,
    authorization: req.headers.authorization,
  });
  const shipment = await shipmentService.createShipment({
    ...req.body,
    companyId,
    origin: references.originPort.name,
    destination: references.destinationPort.name,
  });

  res.status(201).json({
    success: true,
    message: "Shipment created successfully.",
    data: shipment,
  });
});

export const replaceShipment = asyncHandler(async (req, res) => {
  const companyId = getCompanyIdForUser(req.user);
  const existing = await shipmentService.getShipmentById(Number(req.params.id), { companyId });
  const targetCompanyId = existing.companyId ?? getCompanyIdForCreate(req.user, req.body.companyId);
  const references = await verifyShipmentReferences({
    ...req.body,
    companyId: targetCompanyId,
    authorization: req.headers.authorization,
  });
  const shipment = await shipmentService.replaceShipment(Number(req.params.id), {
    ...req.body,
    companyId: targetCompanyId,
    origin: references.originPort.name,
    destination: references.destinationPort.name,
  });

  res.status(200).json({
    success: true,
    message: "Shipment updated successfully.",
    data: shipment,
  });
});

export const patchShipment = asyncHandler(async (req, res) => {
  const companyId = getCompanyIdForUser(req.user);
  const existing = await shipmentService.getShipmentById(Number(req.params.id), { companyId });
  const portData = {
    originPortId: req.body.originPortId ?? existing.originPortId,
    destinationPortId: req.body.destinationPortId ?? existing.destinationPortId,
  };
  const references = await verifyShipmentReferences({
    shipId: req.body.shipId ?? existing.shipId,
    ...portData,
    companyId: existing.companyId,
    authorization: req.headers.authorization,
  });
  const shipment = await shipmentService.patchShipment(Number(req.params.id), {
    ...req.body,
    ...portData,
    origin: references.originPort.name,
    destination: references.destinationPort.name,
  }, { companyId });

  res.status(200).json({
    success: true,
    message: "Shipment updated successfully.",
    data: shipment,
  });
});

export const deleteShipment = asyncHandler(async (req, res) => {
  await shipmentService.deleteShipment(Number(req.params.id), { companyId: getCompanyIdForUser(req.user) });

  res.status(200).json({
    success: true,
    message: "Shipment deleted successfully.",
  });
});
