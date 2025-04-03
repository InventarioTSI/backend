import { Historic } from "../database/historic.js";
import { v4 as uuidv4 } from "uuid";

const getDeviceHistoric = async (deviceId) => {
  const historic = await Historic.getDeviceHistoric(deviceId);
  return historic;
};

const createHistoric = async (newHistoric) => {
  // Validación adicional para evitar registros genéricos
  if (!newHistoric.Observaciones || newHistoric.Observaciones.trim() === "") {
    throw new Error("Las observaciones no pueden estar vacías");
  }

  // Evitar registros genéricos de "actualización"
  if (
    newHistoric.Observaciones.toLowerCase().includes(
      "actualización del dispositivo"
    ) ||
    newHistoric.Observaciones === "Actualización de campos"
  ) {
    return null; // No crear este registro
  }

  const HistoricToInsert = {
    ...newHistoric,
    Fecha: new Date(),
    Id: uuidv4(),
    Tipo: newHistoric.Tipo || "Modificación", // Cambiamos el tipo por defecto
  };

  const createdHistoric = await Historic.createHistoric(HistoricToInsert);
  return createdHistoric;
};

export const HistoricService = {
  getDeviceHistoric,
  createHistoric,
};
