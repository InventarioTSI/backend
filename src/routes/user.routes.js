import express from "express";
import { checkAdminHandler, getAllUsersHandler } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsersHandler); // Ruta para obtener todos los usuarios

router.get("/auth/check-admin", authMiddleware, checkAdminHandler);

export default router;