import express from "express";
import cors from "cors";
import morgan from "morgan";

import shipmentRoutes from "./routes/shipment.routes.js";

import { globalError } from "./middleware/globalError.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/shipments", shipmentRoutes);

app.use(globalError);


export default app;