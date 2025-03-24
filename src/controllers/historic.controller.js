import { HistoricService } from "../services/historic.service.js";
import { body, validationResult } from "express-validator";

const getDeviceHistoric = async (req, res) => {
  const { deviceId } = req.params;

  try {
    if (!deviceId) {
      return res.status(400).send({
        status: "FAILED",
        data: "device id is required",
      });
    }

    const historic = await HistoricService.getDeviceHistoric(deviceId);
    res.status(200).send({ status: "OK", data: historic });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const createHistoric = async (req, res) => {
  try {
    await body().notEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: "FAILED", data: errors.array() });
    }

    const { IdEquipo, Observaciones, Creador, UsuarioAsignado, Tipo } =
      req.body;

    const newHistoric = {
      IdEquipo,
      Observaciones,
      Creador,
      UsuarioAsignado,
      Tipo,
    };

    console.log(newHistoric);
    const createdHistoric = await HistoricService.createHistoric(newHistoric);
    res.status(201).send({ status: "OK", data: createdHistoric });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

export const HistoricController = {
  getDeviceHistoric,
  createHistoric,
};
