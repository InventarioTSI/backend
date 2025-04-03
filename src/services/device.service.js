import { Device } from "../database/device.js";
import { v4 as uuidv4 } from "uuid";

const getAllDevices = async (
  page,
  limit,
  searchTerm,
  stateFilter,
  employeeFilter
) => {
  const allDevices = await Device.getAllDevices(
    page,
    limit,
    searchTerm,
    stateFilter,
    employeeFilter
  );
  return allDevices;
};

const getOneDevice = async (deviceType, deviceId) => {
  const device = await Device.getOneDevice(deviceType, deviceId);
  return device;
};

const getDeviceForm = async (deviceType) => {
  const deviceForm = await Device.getDeviceForm(deviceType);
  return deviceForm;
};

const createDevice = async (newDevice, creador) => {
  const DeviceToInsert = {
    deviceType: newDevice.deviceType,
    fields: {
      ...newDevice.fields,
      Id: uuidv4(),
    },
  };

  const createdDevice = await Device.createDevice(DeviceToInsert, creador);
  return createdDevice;
};

const updateDevice = async (deviceType, deviceId, changes, creador) => {
  // Solo actualiza el dispositivo, sin crear histórico
  const updatedDevice = await Device.updateDevice(
    deviceType,
    deviceId,
    changes
  );
  return updatedDevice;
};

const deleteDevice = async (deviceType, deviceId) => {
  const deletedDevice = await Device.deleteDevice(deviceType, deviceId);
  return deletedDevice;
};

export const DeviceService = {
  getAllDevices,
  getOneDevice,
  getDeviceForm,
  createDevice,
  updateDevice,
  deleteDevice,
};
