import express from "express";
import { getAllUsersHandler } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsersHandler); // Ruta para obtener todos los usuarios

export default router;