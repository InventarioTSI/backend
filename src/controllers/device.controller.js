import { DeviceService } from "../services/device.service.js";
import { body, validationResult } from "express-validator";

const getAllDevices = async (req, res) => {
  const { page, limit, searchTerm, stateFilter, employeeFilter } = req.query;

  try {
    // Agregar encabezado Cache-Control para evitar el almacenamiento en caché
    res.set("Cache-Control", "no-store");

    const { devices, total, employees } = await DeviceService.getAllDevices(
      page,
      limit,
      searchTerm,
      stateFilter,
      employeeFilter
    );
    res.status(200).send({ status: "OK", data: { devices, total, employees } });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const getOneDevice = async (req, res) => {
  try {
    const { deviceType, deviceId } = req.params;

    if (!deviceType || !deviceId) {
      return res.status(400).send({
        status: "FAILED",
        data: "device type and id is required",
      });
    }

    const device = await DeviceService.getOneDevice(deviceType, deviceId);
    res.status(200).send({ status: "OK", data: device });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const getDeviceForm = async (req, res) => {
  try {
    const { deviceType } = req.params;

    if (!deviceType) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "device type is required" });
    }

    const deviceForm = await DeviceService.getDeviceForm(deviceType);
    res.status(200).send({ status: "OK", data: deviceForm });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const createDevice = async (req, res) => {
  try {
    await body().notEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "fields are required" });
    }

    const newDevice = {
      deviceType: req.params.deviceType,
      fields: req.body,
    };

    const creador = req.user.userName;

    const createdDevice = await DeviceService.createDevice(newDevice, creador);

    return res.status(201).send({
      status: "OK",
      data: createdDevice,
    });
  } catch (error) {
    return res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const updateDevice = async (req, res) => {
  try {
    const {
      body,
      params: { deviceType, deviceId },
    } = req;

    if (!deviceType || !deviceId) {
      return res.status(400).send({
        status: "FAILED",
        data: "device type and id is required",
      });
    }

    if (!body) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "fields are required" });
    }

    // Actualizamos sin enviar el creador
    const updatedDevice = await DeviceService.updateDevice(
      deviceType,
      deviceId,
      body
    );

    res.status(200).send({ status: "OK", data: updatedDevice });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const deleteDevice = async (req, res) => {
  const { deviceType, deviceId } = req.params;

  if (!deviceType || !deviceId) {
    return res.status(400).send({
      status: "FAILED",
      data: "device type and id is required",
    });
  }

  const deletedDevice = await DeviceService.deleteDevice(deviceType, deviceId);
  res.status(200).send({ status: "OK", data: deletedDevice });
};

export const DeviceController = {
  getAllDevices,
  getOneDevice,
  getDeviceForm,
  createDevice,
  updateDevice,
  deleteDevice,
};
