import { Place } from "../database/place.js";

const getAllPlaces = async () => {
  const allPlaces = await Place.getAllPlaces();
  return allPlaces;
};

const getOnePlace = async (place) => {
  const response = await Place.getOnePlace(place);
  return response;
};

const createPlace = async (Puesto, Empleado, Planta) => {
  const createdPlace = await Place.createPlace(Puesto, Empleado, Planta);
  return createdPlace;
};

const updatePlace = async (place, changes) => {
  const updatedPlace = await Place.updatePlace(place, changes);
  return updatedPlace;
};

const deletePlace = async (place) => {
  const deletedPlace = await Place.deletePlace(place);
  return deletedPlace;
};

export const PlaceService = {
  getAllPlaces,
  getOnePlace,
  createPlace,
  updatePlace,
  deletePlace,
};
