import { Router } from "express";
import { DeviceController } from "../controllers/device.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { roleRequired } from "../middlewares/roleAuth.js";

const router = Router();

router
  // Ruta para obtener todos los dispositivos
  .get("/", authRequired, async (req, res) => {
    res.set('Cache-Control', 'no-store'); // No guardar en caché

    try {
      // Aquí llamamos al controlador para obtener los dispositivos
      const devices = await DeviceController.getAllDevices(req, res);
      res.status(200).json(devices); // Devuelves los dispositivos como respuesta
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener dispositivos" });
    }
  })

  .get(
    "/:deviceType/:deviceId",
    authRequired,
    DeviceController.getOneDevice
  )
  .get(
    "/:deviceType",
    authRequired,
    DeviceController.getDeviceForm
  )
  .post(
    "/:deviceType",
    authRequired,
    roleRequired("Admin"),
    DeviceController.createDevice
  )
  .patch(
    "/:deviceType/:deviceId",
    authRequired,
    roleRequired("Admin"),
    DeviceController.updateDevice
  )
  .delete(
    "/:deviceType/:deviceId",
    authRequired,
    roleRequired("Admin"),
    DeviceController.deleteDevice
  );

export default router;