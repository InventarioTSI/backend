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
    const { IdEquipo, Observaciones, Creador, UsuarioAsignado, Tipo } =
      req.body;

    // Validación más estricta
    if (!Observaciones || Observaciones.trim() === "") {
      return res.status(400).send({
        status: "FAILED",
        data: { error: "Las observaciones no pueden estar vacías" },
      });
    }

    if (!IdEquipo || !Creador) {
      return res.status(400).send({
        status: "FAILED",
        data: { error: "Faltan campos obligatorios" },
      });
    }

    const newHistoric = {
      IdEquipo,
      Observaciones,
      Creador,
      UsuarioAsignado: UsuarioAsignado || null,
      Tipo: Tipo || "Actualización", // Valor por defecto más simple
    };

    const createdHistoric = await HistoricService.createHistoric(newHistoric);
    res.status(201).send({ status: "OK", data: createdHistoric });
  } catch (error) {
    console.error("Error creating historic record:", error);
    res.status(500).send({
      status: "FAILED",
      data: { error: error.message },
    });
  }
};

export const HistoricController = {
  getDeviceHistoric,
  createHistoric,
};
