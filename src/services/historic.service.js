import { Historic } from "../database/historic.js";
import { Device } from "../database/device.js";
import { v4 as uuidv4 } from "uuid";

const getDeviceHistoric = async (deviceId) => {
  const historic = await Historic.getDeviceHistoric(deviceId);
  return historic;
};

const createHistoric = async (newHistoric) => {
  const HistoricToInsert = {
    ...newHistoric,
    Fecha: new Date(),
    Id: uuidv4(),
  };

  const createdHistoric = await Historic.createHistoric(HistoricToInsert);
  return createdHistoric;
};

export const HistoricService = {
  getDeviceHistoric,
  createHistoric,
};
