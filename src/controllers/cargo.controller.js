import * as cargoService from "../services/cargo.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllCargo = asyncHandler(async (req, res) => {
  const result = await cargoService.getAllCargo(req.query);

  res.status(200).json({
    success: true,
    count: result.pagination.total,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getCargoById = asyncHandler(async (req, res) => {
  const cargo = await cargoService.getCargoById(
    Number(req.params.id)
  );

  res.status(200).json({
    success: true,
    data: cargo,
  });
});

export const createCargo = asyncHandler(async (req, res) => {

  console.log(req.user);
  const cargo = await cargoService.createCargo(req.body, req.user);

  res.status(201).json({
    success: true,
    message: "Cargo created successfully.",
    data: cargo,
  });
});

export const replaceCargo = asyncHandler(async (req, res) => {
  const cargo = await cargoService.replaceCargo(
    Number(req.params.id),
    req.body,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Cargo updated successfully.",
    data: cargo,
  });
});

export const patchCargo = asyncHandler(async (req, res) => {
  const cargo = await cargoService.patchCargo(
    Number(req.params.id),
    req.body,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Cargo updated successfully.",
    data: cargo,
  });
});

export const deleteCargo = asyncHandler(async (req, res) => {
  await cargoService.deleteCargo(
    Number(req.params.id),
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Cargo deleted successfully.",
  });
});