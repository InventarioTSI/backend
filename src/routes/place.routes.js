import { Router } from "express";
import { PlaceController } from "../controllers/place.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { roleRequired } from "../middlewares/roleAuth.js";

const router = Router();

router
  .get("/", PlaceController.getAllPlaces)
  .get("/:place", PlaceController.getOnePlace)
  .post("/",
    authRequired,
    roleRequired("Admin"),
    PlaceController.createPlace)
  .patch("/:place",
    authRequired,
    PlaceController.updatePlace)
  .delete("/:place",
    authRequired,
    PlaceController.deletePlace);

export default router;
