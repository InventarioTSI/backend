import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/register", AuthController.register)
  .post("/login", AuthController.login)
  .post("/logout", AuthController.logout)
  .get("/verify", AuthController.verify);

export default router;
