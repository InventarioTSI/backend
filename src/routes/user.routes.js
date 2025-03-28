import express from "express";
import { checkAdminHandler, createUserHandler, deleteUserHandler, getAllUsersHandler } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsersHandler); // Ruta para obtener todos los usuarios

router.get("/auth/check-admin", authMiddleware, checkAdminHandler);

router.post("/", authMiddleware, createUserHandler);

router.delete("/:userId", authMiddleware, deleteUserHandler);

export default router;