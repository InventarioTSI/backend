import express from "express";
import { checkAdminHandler, deleteUserHandler, getAllUsersHandler, register, updateUserHandler } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsersHandler);

router.get("/auth/check-admin", authMiddleware, checkAdminHandler);

router.post("/", register);

router.delete("/:userId", authMiddleware, deleteUserHandler);

router.put("/:userId", authMiddleware, updateUserHandler); 

export default router;