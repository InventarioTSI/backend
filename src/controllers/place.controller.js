import { PlaceService } from "../services/place.service.js";
import { body, validationResult } from "express-validator";
import { roleRequired } from "../middlewares/roleAuth.js";

const getAllPlaces = async (req, res) => {
  try {
    const places = await PlaceService.getAllPlaces();
    res.status(200).send({ status: "OK", data: places });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const getOnePlace = async (req, res) => {
  try {
    const { place } = req.params;

    if (!place) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "place is required" });
    }

    const Place = await PlaceService.getOnePlace(place);
    res.status(200).send({ status: "OK", data: Place });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const createPlace = async (req, res) => {
  try {
    await body("Puesto").notEmpty().run(req);
    await body("Empleado").notEmpty().run(req);
    await body("Planta").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: "FAILED", data: errors.array() });
    }

    const { Puesto, Empleado, Planta } = req.body;
    const Place = await PlaceService.createPlace(Puesto, Empleado, Planta);
    res.status(201).send({ status: "OK", data: Place });
  } catch (error) {
    res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const updatePlace = async (req, res) => {
  roleRequired("Admin")(req, res, async () => {
    try {
      const { place } = req.params;
      const changes = req.body;

      if (!place) {
        return res
          .status(400)
          .send({ status: "FAILED", data: "place is required" });
      }

      if (!changes) {
        return res
          .status(400)
          .send({ status: "FAILED", data: "changes are required" });
      }

      const Place = await PlaceService.updatePlace(place, changes);
      res.status(200).send({ status: "OK", data: Place });
    } catch (error) {
      res.status(500).send({ status: "FAILED", data: error.message });
    }
  });
};

const deletePlace = async (req, res) => {
  roleRequired("Admin")(req, res, async () => {
    try {
      const { place } = req.params;

      if (!place) {
        return res
          .status(400)
          .send({ status: "FAILED", data: "place is required" });
      }

      const Place = await PlaceService.deletePlace(place);
      res.status(200).send({ status: "OK", data: Place });
    } catch (error) {
      res.status(500).send({ status: "FAILED", data: error.message });
    }
  });
};

export const PlaceController = {
  getAllPlaces,
  getOnePlace,
  createPlace,
  updatePlace,
  deletePlace,
};
