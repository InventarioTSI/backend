import { Router } from "express";
import { HistoricController } from "../controllers/historic.controller.js";

const router = Router();

router
  .get("/:deviceId", HistoricController.getDeviceHistoric)
  .post("/", HistoricController.createHistoric);

export default router;
