import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import deviceRoutes from "./routes/device.routes.js";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import historicRoutes from "./routes/historic.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/places", placeRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/historic", historicRoutes);
app.use("/api/auth", authRoutes);

export default app;
