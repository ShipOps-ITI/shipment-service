import assert from "node:assert/strict";
import test from "node:test";
import { buildPagination, buildShipmentFilterWhere, buildCargoFilterWhere } from "../src/utils/listQuery.js";

test("buildPagination returns default values for missing query params", () => {
  const result = buildPagination({});

  assert.equal(result.page, 1);
  assert.equal(result.limit, 10);
  assert.equal(result.skip, 0);
});

test("buildPagination uses provided page and limit values", () => {
  const result = buildPagination({ page: 2, limit: 5 });

  assert.equal(result.page, 2);
  assert.equal(result.limit, 5);
  assert.equal(result.skip, 5);
});

test("buildShipmentFilterWhere applies status and origin/destination filters", () => {
  const where = buildShipmentFilterWhere({
    status: "Pending",
    origin: "Abuqir",
    destination: "Rotterdam",
  });

  assert.deepEqual(where, {
    status: "Pending",
    origin: { contains: "Abuqir", mode: "insensitive" },
    destination: { contains: "Rotterdam", mode: "insensitive" },
  });
});

test("buildShipmentFilterWhere builds search OR clause", () => {
  const where = buildShipmentFilterWhere({ search: "ABC" });

  assert.equal(where.OR.length, 4);
  assert.deepEqual(where.OR[0], {
    shipmentNumber: { contains: "ABC", mode: "insensitive" },
  });
});

test("buildCargoFilterWhere applies shipmentId, status, and search filters", () => {
  const where = buildCargoFilterWhere({
    shipmentId: 3,
    status: "Loaded",
    search: "box",
  });

  assert.deepEqual(where, {
    shipmentId: 3,
    status: "Loaded",
    OR: [
      { cargoName: { contains: "box", mode: "insensitive" } },
      { cargoType: { contains: "box", mode: "insensitive" } },
      { containerNumber: { contains: "box", mode: "insensitive" } },
      { description: { contains: "box", mode: "insensitive" } },
    ],
  });
});
